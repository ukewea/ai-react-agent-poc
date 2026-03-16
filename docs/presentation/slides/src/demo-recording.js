// Real recording from `python react_agent.py --record` on 2026-03-07.

export const DEMO_DATA = {
  model: "claude-sonnet-4-6",
  pricing: { input_per_mtok: 3, output_per_mtok: 15 },
  steps: [
    {
      step: 1,
      blocks: [
        {
          type: "thought",
          text: "Sure! To find the best meeting time, I'll gather all the information I need in parallel \u2014 current timezone data for both New York and London, plus any public holidays in both the US and UK for this year.",
        },
        {
          type: "action",
          tool: "get_timezone_info",
          args: "timezone='America/New_York'",
        },
        {
          type: "observation",
          text: '{\n  "timezone": "America/New_York",\n  "datetime": "2026-03-07T09:22:19",\n  "date": "03/07/2026",\n  "time": "09:22",\n  "utc_offset": "America/New_York",\n  "dst_active": false,\n  "day_of_week": "Saturday"\n}',
        },
        {
          type: "action",
          tool: "get_timezone_info",
          args: "timezone='Europe/London'",
        },
        {
          type: "observation",
          text: '{\n  "timezone": "Europe/London",\n  "datetime": "2026-03-07T14:22:20",\n  "date": "03/07/2026",\n  "time": "14:22",\n  "utc_offset": "Europe/London",\n  "dst_active": false,\n  "day_of_week": "Saturday"\n}',
        },
        {
          type: "action",
          tool: "get_public_holidays",
          args: "country_code='US', year=2025",
        },
        {
          type: "observation",
          text: '[\n  { "date": "2025-01-01", "name": "New Year\'s Day" },\n  { "date": "2025-01-20", "name": "Martin Luther King, Jr. Day" },\n  { "date": "2025-02-17", "name": "Washington\'s Birthday" },\n  { "date": "2025-05-26", "name": "Memorial Day" },\n  { "date": "2025-07-04", "name": "Independence Day" },\n  { "date": "2025-09-01", "name": "Labor Day" },\n  { "date": "2025-11-27", "name": "Thanksgiving Day" },\n  { "date": "2025-12-25", "name": "Christmas Day" },\n  ... (8 more entries)\n]',
        },
        {
          type: "action",
          tool: "get_public_holidays",
          args: "country_code='GB', year=2025",
        },
        {
          type: "observation",
          text: '[\n  { "date": "2025-01-01", "name": "New Year\'s Day" },\n  { "date": "2025-03-17", "name": "Saint Patrick\'s Day" },\n  { "date": "2025-04-18", "name": "Good Friday" },\n  { "date": "2025-04-21", "name": "Easter Monday" },\n  { "date": "2025-05-05", "name": "Early May Bank Holiday" },\n  { "date": "2025-05-26", "name": "Spring Bank Holiday" },\n  { "date": "2025-12-25", "name": "Christmas Day" },\n  { "date": "2025-12-26", "name": "Boxing Day" },\n  ... (5 more entries)\n]',
        },
      ],
      usage: { input_tokens: 907, output_tokens: 260 },
      cost_usd: 0.006621,
      cumulative_cost_usd: 0.006621,
    },
    {
      step: 2,
      blocks: [
        {
          type: "thought",
          text: "Since the holidays returned are for 2025 but today is Saturday, March 7, 2026, let me fetch the correct holiday data for 2026!",
        },
        {
          type: "action",
          tool: "get_public_holidays",
          args: "country_code='US', year=2026",
        },
        {
          type: "observation",
          text: '[\n  { "date": "2026-01-01", "name": "New Year\'s Day" },\n  { "date": "2026-01-19", "name": "Martin Luther King, Jr. Day" },\n  { "date": "2026-02-16", "name": "Washington\'s Birthday" },\n  { "date": "2026-04-03", "name": "Good Friday" },\n  { "date": "2026-05-25", "name": "Memorial Day" },\n  { "date": "2026-07-03", "name": "Independence Day" },\n  { "date": "2026-09-07", "name": "Labor Day" },\n  { "date": "2026-11-26", "name": "Thanksgiving Day" },\n  ... (8 more entries)\n]',
        },
        {
          type: "action",
          tool: "get_public_holidays",
          args: "country_code='GB', year=2026",
        },
        {
          type: "observation",
          text: '[\n  { "date": "2026-01-01", "name": "New Year\'s Day" },\n  { "date": "2026-03-17", "name": "Saint Patrick\'s Day" },\n  { "date": "2026-04-03", "name": "Good Friday" },\n  { "date": "2026-04-06", "name": "Easter Monday" },\n  { "date": "2026-05-04", "name": "Early May Bank Holiday" },\n  { "date": "2026-05-25", "name": "Spring Bank Holiday" },\n  { "date": "2026-12-25", "name": "Christmas Day" },\n  { "date": "2026-12-28", "name": "Boxing Day" },\n  ... (6 more entries)\n]',
        },
      ],
      usage: { input_tokens: 2326, output_tokens: 170 },
      cost_usd: 0.009528,
      cumulative_cost_usd: 0.016149,
    },
    {
      step: 3,
      blocks: [
        {
          type: "thought",
          text: "I now have enough evidence to recommend a slot.\n\nReasoning:\n- Next week the effective gap is 4 hours, because the US switches to DST on March 8 while the UK stays on GMT until March 29.\n- There are no public holidays in either country during March 9\u201313, so all five weekdays are available.\n- 10:00 AM New York becomes 2:00 PM London, which keeps both teams inside normal working hours.\n- I would avoid going earlier than 9:00 AM New York or later than noon New York, so 10:00 AM is the cleanest shared slot.\n- Tuesday and Wednesday are stronger than Monday or Friday because they avoid weekly ramp-up and wind-down.\n\nThat points to Tuesday, March 10 or Wednesday, March 11 at 10:00 AM New York / 2:00 PM London.",
        },
      ],
      usage: { input_tokens: 3445, output_tokens: 724 },
      cost_usd: 0.021195,
      cumulative_cost_usd: 0.037344,
    },
  ],
  total: {
    input_tokens: 6678,
    output_tokens: 1154,
    total_cost_usd: 0.037344,
    api_calls: 3,
  },
}
