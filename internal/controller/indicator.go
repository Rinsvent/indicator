package controller

import (
	"context"
	"git.rinsvent.ru/rinsvent/indicator/internal/request"
	"git.rinsvent.ru/rinsvent/indicator/internal/response"
	"git.rinsvent.ru/rinsvent/indicator/internal/service"
)

func GetIndicatorsHandler(ctx context.Context, input *request.GetIndicatorsRequest) (*response.IndicatorsResponse, error) {
	indicators := service.IM().Find()

	resp := response.IndicatorsResponse{
		Body: response.BuildIndicatorsFromModels(indicators),
	}
	return &resp, nil
}

func UpsertIndicatorHandler(ctx context.Context, input *request.UpsertIndicatorRequest) (*response.OkResponse, error) {
	service.IM().Upsert(input.Code, input.Body)
	return &response.OkResponse{}, nil
}
