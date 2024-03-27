ALTER TABLE event
    ADD COLUMN image_id int;
ALTER Table artifact
    ADD COLUMN type ENUM('SUBMISSION', 'EVENT_IMAGE', 'PROFILE_PICTURE');
ALTER TABLE user
    ADD COLUMN profile_picture_id int;
