CREATE TABLE members (
    id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    days_work TEXT [] DEFAULT '{}' NOT NULL,
    upcoming_days_off TIMESTAMP [] DEFAULT '{}' NOT NULL,
    work_address TEXT NOT NULL,
    preferred_home_time_arrival TEXT NOT NULL,
    time_work_starts TEXT NOT NULL,
    time_off_work TEXT NOT NULL,
    passenger_id BIGINT REFERENCES passengers(id) ON DELETE CASCADE NOT NULL
);