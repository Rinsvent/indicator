package controller

import (
	"context"
	"git.rinsvent.ru/rinsvent/indicator/internal/request"
	"git.rinsvent.ru/rinsvent/indicator/internal/response"
	"git.rinsvent.ru/rinsvent/indicator/internal/service"
	"github.com/danielgtaylor/huma/v2/sse"
)

func GetIndicatorsHandler(ctx context.Context, input *request.GetIndicatorsRequest) (*response.IndicatorsResponse, error) {
	indicators := service.IM().Find()

	resp := response.IndicatorsResponse{
		Body: response.BuildIndicatorsFromModels(indicators),
	}
	return &resp, nil
}

func UpsertIndicatorHandler(ctx context.Context, input *request.UpsertIndicatorRequest) (*response.OkResponse, error) {
	i, isUpdated := service.IM().Upsert(input.Code, input.Body)
	if isUpdated {
		service.GetBrokerInstance().Broadcast(response.BuildIndicatorFromModel(i))
	}
	return &response.OkResponse{}, nil
}

func DeleteIndicatorHandler(ctx context.Context, input *request.DeleteIndicatorRequest) (*response.OkResponse, error) {
	service.IM().Remove(input.Code)
	service.GetBrokerInstance().Broadcast(response.DeleteIndicatorMessage{Code: input.Code})

	return &response.OkResponse{}, nil
}

func SSEHandler(ctx context.Context, input *struct{}, send sse.Sender) {
	ch := service.GetBrokerInstance().Subscribe()
	defer service.GetBrokerInstance().Unsubscribe(ch)

	for {
		select {
		case message := <-ch:
			send.Data(message)
		case <-ctx.Done():
			return
		}
	}
}
