ALTER TABLE event
    ADD COLUMN image_id int;
ALter Table artifact
    ADD COLUMN type ENUM('SUBMISSION', 'EVENT_IMAGE', 'PROFILE_PICTURE');
