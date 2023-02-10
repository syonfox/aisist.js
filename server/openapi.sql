
CREATE TABLE openapi_schemas (
                                 id SERIAL PRIMARY KEY,                               -- unique identifier for the schema
                                 openapi VARCHAR(255) NOT NULL,                       -- version of the OpenAPI specification
                                 info JSONB NOT NULL,                                 -- general information about the API
                                 json_schema_dialect VARCHAR(255),                    -- default value for the $schema keyword within Schema Objects
                                 servers JSONB NOT NULL,                              -- list of servers that the API is available on
                                 paths JSONB NOT NULL,                                -- list of API endpoints and their associated operations
                                 webhooks JSONB,                                      -- incoming webhooks that may be received by the API
                                 components JSONB NOT NULL,                           -- list of components (e.g. schemas, responses, parameters) used in the API
                                 security JSONB,                                      -- security mechanisms that can be used across the API
                                 tags JSONB,                                          -- list of tags used by the document with additional metadata
                                 external_docs JSONB,                                 -- additional external documentation
                                 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),   -- timestamp for when the schema was created
                                 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()    -- timestamp for when the schema was last updated
);


-- This table stores information about API integrations
CREATE TABLE api_integrations (
  -- unique identifier for the integration
  id SERIAL PRIMARY KEY,
  -- name of the API
  api_name VARCHAR(255) NOT NULL,
  --link a specification of this api
  openapi_id uuid REFERENCES openapi_schemas(id),
  -- base URL for the API
  base_url VARCHAR(255) NOT NULL,
  -- API key or other authentication credentials
  api_key VARCHAR(255) NOT NULL,
  -- metadata about the API (e.g. version, supported features)
  metadata JSONB NOT NULL,
  created_by     INTEGER DEFAULT current_user,
  modified_by    INTEGER DEFAULT current_user,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  modified_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- This table stores information about API endpoints
-- this is for if you do not wish to use the openapi spec but still wish to track your endpont routes
-- DEPRICATED MAYBE??? THINK ABOUT IT
CREATE TABLE api_endpoints
(
    -- unique identifier for the endpoint
    id             SERIAL PRIMARY KEY,
    -- unique identifier for the API integration
    integration_id INTEGER REFERENCES api_integrations (id) NOT NULL,
    -- URL of the endpoint
    endpoint       VARCHAR(255)                             NOT NULL,
    -- HTTP method (e.g. GET, POST, PUT, DELETE)
    method         VARCHAR(10)                              NOT NULL,
    -- description of the endpoint
    description    VARCHAR(255)                             NOT NULL,
    -- optional override for the base URL of the API
    base_url       VARCHAR(255),

    created_by     INTEGER DEFAULT current_user,
    modified_by    INTEGER DEFAULT current_user,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE VIEW v_openapi_servers AS
SELECT o.id AS openapi_id,
       s.value->'url' AS url,
       s.value->'description' AS description,
       s.value->'variables' AS variables
FROM openapi_schemas o
JOIN jsonb_each(o.servers) s ON TRUE;

CREATE VIEW v_openapi_endpoints AS
SELECT o.id AS openapi_id,
       p.key AS endpoint,
       m.key AS method,
       p.value->'description' AS description,
       m.value AS operation
FROM openapi_schemas o
JOIN jsonb_each(o.paths) p ON TRUE
JOIN jsonb_each(p.value) m ON TRUE;
-- Note that this view assumes that the paths object in the OpenAPI schema is in the following format:
--
-- {
--   "<endpoint_url>": {
--     "<http_method>": {
--       ... endpoint operation details ...
--     },
--     ... additional HTTP methods ...
--   },
--   ... additional endpoints ...
-- }

CREATE VIEW v_openapi_webhooks AS
SELECT o.id AS openapi_id,
       w.key AS webhook_name,
       w.value->'description' AS description,
       w.value->'operationId' AS operation_id,
       w.value->'parameters' AS parameters,
       w.value->'requestBody' AS request_body,
       w.value->'responses' AS responses,
       w.value->'security' AS security
FROM openapi_schemas o
JOIN jsonb_each(o.webhooks) w ON TRUE;
