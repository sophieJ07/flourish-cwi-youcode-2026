-- short term --

INSERT INTO public.sample_mood_entries (
  shelter_id, mood_level, created_at,
  short_survey_completed, long_survey_completed,
  sq1_answer, sq2_answer, sq3_answer,
  lq1_answer, lq2_answer, lq3_answer,
  lq4_answer, lq5_answer, lq6_answer
)
-- Row 1
VALUES (
  '6e4d3f9b-469a-4fae-a95e-14cb34266b30', -- S014
  3,
  '2026-04-04T10:00:00Z',
  true,
  false,
  1, 2, 3,
  null, null, null, null, null, null
);
-- Row 2

VALUES (
  '96cb7672-e921-4eed-b662-c8c6a2fa4ba0', -- S083
  4,
  '2026-04-04T10:20:00Z',
  true,
  false,
  2, 1, 3,
  null, null, null, null, null, null
);

-- Row 3
INSERT INTO public.sample_mood_entries (
  shelter_id, mood_level, created_at,
  short_survey_completed, long_survey_completed,
  sq1_answer, sq2_answer, sq3_answer,
  lq1_answer, lq2_answer, lq3_answer,
  lq4_answer, lq5_answer, lq6_answer
)
VALUES (
  '03a7ccd5-f03f-474e-87b0-8fe649d148c7', -- S001
  2,
  '2026-04-04T10:40:00Z',
  true,
  false,
  1, 3, 2,
  null, null, null, null, null, null
);

-- Row 4
INSERT INTO public.sample_mood_entries (
  shelter_id, mood_level, created_at,
  short_survey_completed, long_survey_completed,
  sq1_answer, sq2_answer, sq3_answer,
  lq1_answer, lq2_answer, lq3_answer,
  lq4_answer, lq5_answer, lq6_answer
)
VALUES (
  '6e4d3f9b-469a-4fae-a95e-14cb34266b30', -- S052
  5,
  '2026-04-04T11:00:00Z',
  true,
  false,
  4, 2, 3,
  null, null, null, null, null, null
);

-- Row 5
INSERT INTO public.sample_mood_entries (
  shelter_id, mood_level, created_at,
  short_survey_completed, long_survey_completed,
  sq1_answer, sq2_answer, sq3_answer,
  lq1_answer, lq2_answer, lq3_answer,
  lq4_answer, lq5_answer, lq6_answer
)
VALUES (
  '03a7ccd5-f03f-474e-87b0-8fe649d148c7', -- S014
  1,
  '2026-04-04T11:20:00Z',
  true,
  false,
  1, 1, 1,
  null, null, null, null, null, null
);

-- Row 6
INSERT INTO public.sample_mood_entries (
  shelter_id, mood_level, created_at,
  short_survey_completed, long_survey_completed,
  sq1_answer, sq2_answer, sq3_answer,
  lq1_answer, lq2_answer, lq3_answer,
  lq4_answer, lq5_answer, lq6_answer
)
VALUES (
  '96cb7672-e921-4eed-b662-c8c6a2fa4ba0', -- S083
  3,
  '2026-04-04T11:40:00Z',
  true,
  false,
  3, 2, 1,
  null, null, null, null, null, null
);

-- Row 7
INSERT INTO public.sample_mood_entries (
  shelter_id, mood_level, created_at,
  short_survey_completed, long_survey_completed,
  sq1_answer, sq2_answer, sq3_answer,
  lq1_answer, lq2_answer, lq3_answer,
  lq4_answer, lq5_answer, lq6_answer
)
VALUES (
  'f4bd0f77-b8df-4829-b674-fe7948ba4e1c', -- S001
  4,
  '2026-04-04T12:00:00Z',
  true,
  false,
  4, 3, 2,
  null, null, null, null, null, null
);

-- Row 8
INSERT INTO public.sample_mood_entries (
  shelter_id, mood_level, created_at,
  short_survey_completed, long_survey_completed,
  sq1_answer, sq2_answer, sq3_answer,
  lq1_answer, lq2_answer, lq3_answer,
  lq4_answer, lq5_answer, lq6_answer
)
VALUES (
  '6e4d3f9b-469a-4fae-a95e-14cb34266b30', -- S052
  2,
  '2026-04-04T12:20:00Z',
  true,
  false,
  2, 1, 1,
  null, null, null, null, null, null
);

-- Row 9
INSERT INTO public.sample_mood_entries (
  shelter_id, mood_level, created_at,
  short_survey_completed, long_survey_completed,
  sq1_answer, sq2_answer, sq3_answer,
  lq1_answer, lq2_answer, lq3_answer,
  lq4_answer, lq5_answer, lq6_answer
)
VALUES (
  '03a7ccd5-f03f-474e-87b0-8fe649d148c7', -- S014
  5,
  '2026-04-04T12:40:00Z',
  true,
  false,
  3, 2, 4,
  null, null, null, null, null, null
);

-- Row 10
INSERT INTO public.sample_mood_entries (
  shelter_id, mood_level, created_at,
  short_survey_completed, long_survey_completed,
  sq1_answer, sq2_answer, sq3_answer,
  lq1_answer, lq2_answer, lq3_answer,
  lq4_answer, lq5_answer, lq6_answer
)
VALUES (
  'f4bd0f77-b8df-4829-b674-fe7948ba4e1c', -- S083
  3,
  '2026-04-04T13:00:00Z',
  true,
  false,
  4, 3, 1,
  null, null, null, null, null, null
);

DELETE FROM public.sample_mood_entries a
USING public.sample_mood_entries b
WHERE a.id < b.id
  AND a.shelter_id = b.shelter_id
  AND a.created_at = b.created_at;
