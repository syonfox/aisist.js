-- Create the deque table
CREATE TABLE deque (
                       id integer PRIMARY KEY,
                       next_id integer REFERENCES deque (id),
                       head integer REFERENCES deque (id),
                       tail integer REFERENCES deque (id)
);


-- Function to insert a new element at the tail of the deque
CREATE OR REPLACE FUNCTION insert_at_tail(val integer)
RETURNS void AS $$
BEGIN
  -- Check if the deque is empty
  IF (SELECT tail FROM deque) IS NULL THEN
    -- If the deque is empty, insert the new element as both the head and the tail
    INSERT INTO deque (id, next_id, head, tail) VALUES (val, NULL, val, val);
  ELSE
    -- If the deque is not empty, insert the new element as the new tail
    INSERT INTO deque (id, next_id, tail) VALUES (val, NULL, val);
    -- Update the next_id of the previous tail element to point to the new element
    UPDATE deque SET next_id = val WHERE id = (SELECT tail FROM deque);
    -- Update the tail reference to point to the new element
    UPDATE deque SET tail = val;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_at_head(value INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO deque (id, next_id) VALUES (value, (SELECT head FROM deque));
  UPDATE deque SET head = value WHERE head IS NULL;
END;
$$ LANGUAGE plpgsql;


-- Function to insert a new element at the tail of the deque
CREATE OR REPLACE FUNCTION insert_at_tail(val integer)
RETURNS void AS $$
BEGIN
  -- Check if the deque is empty
  IF (SELECT tail FROM deque) IS NULL THEN
    -- If the deque is empty, insert the new element as both the head and the tail
    INSERT INTO deque (id, next_id, head, tail) VALUES (val, NULL, val, val);
  ELSE
    -- If the deque is not empty, insert the new element as the new tail
    INSERT INTO deque (id, next_id, tail) VALUES (val, NULL, val);
    -- Update the next_id of the previous tail element to point to the new element
    UPDATE deque SET next_id = val WHERE id = (SELECT tail FROM deque);
    -- Update the tail reference to point to the new element
    UPDATE deque SET tail = val;
  END IF;
END;
$$ LANGUAGE plpgsql;
