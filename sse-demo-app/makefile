# Makefile

# 変数定義（共通）
DOCKER_REGISTRY := nukano0522
IMAGE_TAG := v0.1.0
NAMESPACE := sse-demo-app
K8S_MANIFEST := ./k8s.yaml

# SERVICE 変数のデフォルト値を front に
SERVICE ?= front

# SERVICE が front か server かで分岐
ifeq ($(SERVICE), front)
  APP_NAME := sse-demo-frontend
  K8S_DEPLOYMENT_NAME := frontend-deployment
  IMAGE_PLACEHOLDER := IMAGE_PLACEHOLDER_FOR_FRONTEND
  DOCKERFILE_PATH := ./frontend
else ifeq ($(SERVICE), server)
  APP_NAME := sse-demo-server
  K8S_DEPLOYMENT_NAME := server-deployment
  IMAGE_PLACEHOLDER := IMAGE_PLACEHOLDER_FOR_SERVER
  DOCKERFILE_PATH := ./server
else
  $(error Invalid SERVICE="$(SERVICE)". Use "front" or "server".)
endif

FRONTEND_IMAGE := $(DOCKER_REGISTRY)/sse-demo-frontend:$(IMAGE_TAG)
SERVER_IMAGE   := $(DOCKER_REGISTRY)/sse-demo-server:$(IMAGE_TAG)

# Docker Build 用ターゲット
.PHONY: build
build:
	docker build -t $(DOCKER_REGISTRY)/$(APP_NAME):$(IMAGE_TAG) $(DOCKERFILE_PATH)

# Docker Push 用ターゲット
.PHONY: push
push:
	docker push $(DOCKER_REGISTRY)/$(APP_NAME):$(IMAGE_TAG)

# Deploy 用ターゲット
.PHONY: deploy
deploy:
	sed -e 's|IMAGE_PLACEHOLDER_FOR_FRONTEND|$(FRONTEND_IMAGE)|g' \
	sed -e 's|IMAGE_PLACEHOLDER_FOR_SERVER|$(SERVER_IMAGE)|g' \
	    $(K8S_MANIFEST) \
	| kubectl apply -n $(NAMESPACE) -f -

# Rollout Restart 用ターゲット
.PHONY: restart
restart:
	kubectl rollout restart deployment/$(K8S_DEPLOYMENT_NAME) -n $(NAMESPACE)

# まとめてビルド & プッシュ & デプロイ
.PHONY: all
all: build push deploy
