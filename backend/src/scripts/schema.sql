-- Database schema for MySOP

-- Create scenes table
CREATE TABLE IF NOT EXISTS scenes (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'yaml',
    tags VARCHAR(255),
    yaml_content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create executions table
CREATE TABLE IF NOT EXISTS executions (
    id UUID PRIMARY KEY,
    scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    params JSONB DEFAULT '{}'::jsonb,
    result JSONB,
    logs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_executions_scene_id ON executions (scene_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON executions (status);
CREATE INDEX IF NOT EXISTS idx_scenes_updated_at ON scenes (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_executions_start_time ON executions (start_time DESC);

-- Sample data
INSERT INTO scenes (
    id, 
    name, 
    description, 
    type, 
    tags, 
    yaml_content, 
    created_at, 
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '示例场景',
    '这是一个基本的示例场景',
    'yaml',
    '示例,基础',
    'name: 示例场景
description: 这是一个示例场景

steps:
  - id: step1
    name: 初始化
    type: initialize
    data:
      message: 开始执行场景
      
  - id: step2
    name: 处理数据
    type: transform
    data:
      input: $ref:step1.result
      transform: uppercase
      
  - id: step3
    name: 完成
    type: notification
    data:
      message: 场景执行完成',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Initial execution
INSERT INTO executions (
    id,
    scene_id,
    status,
    start_time,
    end_time,
    params,
    result,
    logs,
    created_at,
    updated_at
) VALUES (
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    'success',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '2 minutes',
    '{}'::jsonb,
    '{"success": true, "message": "场景执行成功"}'::jsonb,
    '[
        {"timestamp": "2023-03-10T12:00:00Z", "level": "info", "message": "开始执行场景"},
        {"timestamp": "2023-03-10T12:01:30Z", "level": "info", "message": "场景执行成功"}
    ]'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING; 