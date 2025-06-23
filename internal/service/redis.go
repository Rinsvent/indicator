package service

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"os"
)

const (
	setKey = "all_objects"
)

var r *redis.Client

var upsertScript = redis.NewScript(`
		if #ARGV > 0 then
			redis.call('HSET', KEYS[2], unpack(ARGV))
		end
		redis.call('SADD', KEYS[1], KEYS[2])
		return 1
	`)

var deleteScript = redis.NewScript(`
		redis.call('SREM', KEYS[1], KEYS[2])
		redis.call('DEL', KEYS[2])
		return 1
	`)

var getAllScript = redis.NewScript(`
		local keys = redis.call('SMEMBERS', KEYS[1])
		local result = {}
		
		for i, key in ipairs(keys) do
			result[#result+1] = key
			local obj_data = redis.call('HGETALL', key)
			result[#result+1] = #obj_data
			for j = 1, #obj_data do
				result[#result+1] = obj_data[j]
			end
		end
		
		return result
	`)

var clearAllScript = redis.NewScript(`
		local keys = redis.call('SMEMBERS', KEYS[1])
		for _, key in ipairs(keys) do
			redis.call('DEL', key)
		end
		redis.call('DEL', KEYS[1])
		return #keys
	`)

func GetRedisInstance() *redis.Client {
	if r != nil {
		return r
	}
	url := os.Getenv("REDIS_URL")
	if url == "" {
		return nil
	}

	opts, err := redis.ParseURL(url)
	if err != nil {
		panic(err)
	}

	r = redis.NewClient(opts)
	return r
}

func UpsertObject(objKey string, fields map[string]string) error {
	ri := GetRedisInstance()
	if ri == nil {
		return nil
	}

	args := make([]interface{}, 0, len(fields)*2)
	for k, v := range fields {
		args = append(args, k, v)
	}

	return upsertScript.Run(context.Background(), ri, []string{setKey, objKey}, args...).Err()
}

func DeleteObject(objKey string) error {
	ri := GetRedisInstance()
	if ri == nil {
		return nil
	}

	return deleteScript.Run(context.Background(), ri, []string{setKey, objKey}).Err()
}

func ClearAllObjects() (int, error) {
	ri := GetRedisInstance()
	if ri == nil {
		return 0, nil
	}

	res, err := clearAllScript.Run(context.Background(), ri, []string{setKey}).Result()
	if err != nil {
		return 0, err
	}

	if count, ok := res.(int64); ok {
		return int(count), nil
	}
	return 0, fmt.Errorf("unexpected result type: %T", res)
}

func GetAllObjects() (map[string]map[string]string, error) {
	ri := GetRedisInstance()
	if ri == nil {
		result := make(map[string]map[string]string)
		return result, nil
	}

	res, err := getAllScript.Run(context.Background(), ri, []string{setKey}).Result()
	if err != nil {
		return nil, err
	}

	return parseGetAllResult(res)
}

func parseGetAllResult(res interface{}) (map[string]map[string]string, error) {
	data, ok := res.([]interface{})
	if !ok {
		return nil, fmt.Errorf("unexpected result type")
	}

	result := make(map[string]map[string]string)
	idx := 0

	for idx < len(data) {
		// Чтение ключа объекта
		objKey, ok := data[idx].(string)
		if !ok {
			return nil, fmt.Errorf("expected string at position %d", idx)
		}
		idx++

		// Чтение количества пар ключ-значение
		count, ok := data[idx].(int64)
		if !ok {
			return nil, fmt.Errorf("expected int at position %d", idx)
		}
		idx++

		// Чтение пар ключ-значение
		objMap := make(map[string]string)
		end := idx + int(count)
		for idx < end && idx < len(data) {
			if idx+1 >= len(data) {
				return nil, fmt.Errorf("unexpected end of data")
			}

			field, ok1 := data[idx].(string)
			value, ok2 := data[idx+1].(string)
			if !ok1 || !ok2 {
				return nil, fmt.Errorf("expected string pair at position %d", idx)
			}

			objMap[field] = value
			idx += 2
		}

		result[objKey] = objMap
	}

	return result, nil
}
