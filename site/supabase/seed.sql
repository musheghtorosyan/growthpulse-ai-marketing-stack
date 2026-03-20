-- Seeded content used by the landing page demo (dimension metadata).

insert into public.growth_dimensions (slug, name, description, weight, sort_order)
values
  ('acquisition', 'Acquisition', 'How efficiently you acquire qualified users.', 1.0, 1),
  ('activation', 'Activation', 'How quickly new users reach value.', 1.0, 2),
  ('retention', 'Retention', 'How well you keep users and reduce churn.', 1.0, 3),
  ('revenue', 'Revenue', 'How effectively growth turns into revenue.', 1.0, 4),
  ('referral', 'Referral', 'How often customers bring more customers.', 1.0, 5),
  ('seo_health', 'SEO health', 'Index coverage, content quality, and discoverability.', 1.0, 6),
  ('paid_efficiency', 'Paid efficiency', 'Whether paid spend turns into profitable outcomes.', 1.0, 7)
on conflict (slug) do nothing;

