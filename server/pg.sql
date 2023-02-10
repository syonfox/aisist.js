CREATE TABLE openapi_schemas
(
    id         SERIAL PRIMARY KEY,                     -- unique identifier for the schema
    openapi    VARCHAR(255) NOT NULL,                  -- version of the OpenAPI specification
    info       JSONB        NOT NULL,                  -- general information about the API
    servers    JSONB        NOT NULL,                  -- list of servers that the API is available on
    paths      JSONB        NOT NULL,                  -- list of API endpoints and their associated operations
    components JSONB        NOT NULL,                  -- list of components (e.g. schemas, responses, parameters) used in the API
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- timestamp for when the schema was created
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  -- timestamp for when the schema was last updated
);

-- This table stores information about OpenAPI schemas
CREATE TABLE openapi_schemas
(
    -- unique identifier for the schema
    id              SERIAL PRIMARY KEY,
    -- version of the OpenAPI specification
    openapi_version VARCHAR(10) NOT NULL,
    -- general information about the API
    api_info        JSONB       NOT NULL,
    -- list of servers that the API is available on
    api_servers     JSONB       NOT NULL,
    -- list of API endpoints and their associated operations
    api_paths       JSONB       NOT NULL,
    -- list of components (e.g. schemas, responses, parameters) used in the API
    api_components  JSONB       NOT NULL,
    -- timestamp for when the schema was created
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- timestamp for when the schema was last updated
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE deque
(
    id      SERIAL PRIMARY KEY,
    data    TEXT NOT NULL,
    next_id INTEGER REFERENCES deque (id),
    prev_id INTEGER REFERENCES deque (id)
);

-- This table would allow you to store data in each node of the deque,
-- as well as pointers to the previous and next nodes.
-- You could then use SQL statements to manipulate the deque (e.g. inserting and deleting nodes, moving the head and tail pointers, etc.).


-- create


-- This table stores information about API integrations
CREATE TABLE api_integrations (
  -- unique identifier for the integration
  id SERIAL PRIMARY KEY,
  -- name of the API
  api_name VARCHAR(255) NOT NULL,
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


CREATE OR REPLACE FUNCTION update_modified_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Set the modified_by column to the ID of the currently logged-in user
  NEW.modified_by = current_user;
  -- Set the modified_at column to the current timestamp
  NEW.modified_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_modified_columns_trigger
BEFORE UPDATE ON api_endpoints
FOR EACH ROW EXECUTE PROCEDURE update_modified_columns();

CREATE TRIGGER update_modified_columns_trigger
BEFORE UPDATE ON api_integrations
FOR EACH ROW EXECUTE PROCEDURE update_modified_columns();



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

INSERT INTO api_integrations (api_name, base_url, api_key, metadata)
VALUES ('OpenAPI', 'https://api.openai.com', 'your_api_key', '{"version": "3.0.3", "supported_features": ["model introspection", "completions", "edits", "images"]}');

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


--DATA


-- Insert the OpenAPI schema into the api_integrations table
INSERT INTO api_integrations (api_name, base_url, api_key, metadata)
VALUES ('OpenAPI', 'https://api.openai.com', 'your_api_key', '{"version": "3.0.3", "supported_features": ["model introspection", "completions", "edits", "images"]}');

-- Get the ID of the inserted OpenAPI integration
SELECT id INTO openapi_integration_id FROM api_integrations WHERE api_name = 'OpenAPI';

-- Insert the models.get endpoint into the api_endpoints table
INSERT INTO api_endpoints (integration_id, endpoint, method, description)
VALUES (openapi_integration_id, '/v1/models', 'GET', 'Get a list of available models');

-- Insert the models.model endpoint into the api_endpoints table
INSERT INTO api_endpoints (integration_id, endpoint, method, description)
VALUES (openapi_integration_id, '/v1/models/{model}', 'GET', 'Get information about a specific model');

-- Insert the completions.post endpoint into the api_endpoints table
INSERT INTO api_endpoints (integration_id, endpoint, method, description)
VALUES (openapi_integration_id, '/v1/completions', 'POST', 'Generate completions for a given prompt');

INSERT INTO api_endpoints (integration_id, endpoint, method, description)
VALUES (openapi_integration_id, '/v1/edits', 'POST', 'Generate edited text for a given prompt');

-- Insert the images.generations.post endpoint into the api_endpoints table
INSERT INTO api_endpoints (integration_id, endpoint, method, description)
VALUES (openapi_integration_id, '/v1/images/generations', 'POST', 'Generate an image for a given prompt');

-- Insert the images.edits.post endpoint into the api_endpoints table
INSERT INTO api_endpoints (integration_id, endpoint, method, description)
VALUES (openapi_integration_id, '/v1/images/edits', 'POST', 'Edit an image for a given prompt');

-- Insert the images.variations.post endpoint into the api_endpoints table
INSERT INTO api_endpoints (integration_id, endpoint, method, description)
VALUES (openapi_integration_id, '/v1/images/variations', 'POST', 'Generate variations of an image for a given prompt');

-- Insert the edits.post endpoint into the api_endpoints table









-- This
-- TABLE definition
-- includes a NEW integration_id COLUMN that serves AS a FOREIGN KEY TO the api_integrations TABLE. It ALSO includes an optional base_url COLUMN that can be used TO override the base URL OF the API FOR a specific endpoint.
--
-- To override the base URL FOR a specific endpoint, you can
-- INSERT a VALUE INTO the base_url COLUMN WHEN inserting a NEW ROW INTO the api_endpoints TABLE.If
--
--
--






