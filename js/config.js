// ------------------------------------------------------------------------
// Configuration - For data fetched via TBA
// ------------------------------------------------------------------------
var tba_api_ranking_config = [
  { id: 'ranking', title: 'Rank', display_order: 1, arr_index: 0 },
  { id: 'rankingScore', title: 'Ranking Score', display_order: 2, arr_index: 2 },
  { id: 'rankingAuto', title: 'Auto', display_order: 3, arr_index: 3 },
  { id: 'rankingScaleChallenge', title: 'Scale/Chal', display_order: 4, arr_index: 4 },
  { id: 'rankingGoals', title: 'Goals', display_order: 5, arr_index: 5 },
  { id: 'rankingDef', title: 'Defense', display_order: 6, arr_index: 6 },
  { id: 'rankingRecord', title: 'Record (W-L-T)', display_order: 7, arr_index: 7 },
  { id: 'rankingPlayed', title: 'Played', display_order: 8, arr_index: 8 }
];

var tba_api_scoring_config = [
  {
    id: 'xCrossingPoints',
    title: 'Crossing Points',
    dtype: 'int',
    agg: ['autoCrossingPoints', 'teleopCrossingPoints']
  }, {
    id: 'xBoulderPoints',
    title: 'Boulder Points',
    dtype: 'int',
    agg: ['autoBoulderPoints', 'teleopBoulderPoints']
  }, {
    id: 'xTotalHighGoals',
    title: 'High Goals',
    dtype: 'int',
    agg: ['autoBouldersHigh', 'teleopBouldersHigh']
  }, {
    id: 'xTotalLowGoals',
    title: 'Low Goals',
    dtype: 'int',
    agg: ['autoBouldersLow', 'teleopBouldersLow']
  }, {
    id: 'position2',
    title: 'Position Two',
    dtype: 'int',
    sub: 'position2crossings'
  }, {
    id: 'position3',
    title: 'Position Four',
    dtype: 'int',
    sub: 'position3crossings'
  }, {
    id: 'position4',
    title: 'Position Four',
    dtype: 'int',
    sub: 'position4crossings'
  }];

// ------------------------------------------------------------------------
// Configuration - For the primary dashboard
// ------------------------------------------------------------------------
var app_dashboard_config = {
  order: [[1, "asc"], [3, "desc"], [10, "desc"]], // default sort set to total_points | desc
  cols: [
    // major statistical cats
    { data: 'ranking', title: 'Rank', orderSequence: ['asc', 'desc'], defaultContent: 0 },
    { data: 'rankingScore', title: 'RS', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    {
      data: 'oprs', title: 'OPRS', orderSequence: ['desc', 'asc'], defaultContent: 0,
      render: function (data) { return Math.round(data * 100) / 100; }
    },
    {
      data: 'ccwms', title: 'CCWMS', orderSequence: ['desc', 'asc'], defaultContent: 0,
      render: function (data) { return Math.round(data * 100) / 100; }
    },
    {
      data: 'dprs', title: 'DPRS', orderSequence: ['desc', 'asc'], defaultContent: 0,
      render: function (data) { return Math.round(data * 100) / 100; }
    },
    // offense #s and points
    { data: 'xTotalHighGoals', title: 'High Goals', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { data: 'xTotalLowGoals', title: 'Low Goals', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { data: 'xBoulderPoints', title: 'Boulder Points', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { data: 'xCrossingPoints', title: 'Crossing Points', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    // totals
    { title: 'Total Points', data: 'totalPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Teleop Points', data: 'teleopPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Auto Points', data: 'autoPoints', orderSequence: ['desc', 'asc'] },
    // other ranking info
    { title: 'Auto', data: 'rankingAuto', orderSequence: ['desc', 'asc'] },
    { title: 'Scale Challenge', data: 'rankingScaleChallenge', orderSequence: ['desc', 'asc'] },
    { title: 'Goals', data: 'rankingGoals', orderSequence: ['desc', 'asc'] },
    { title: 'Def.', data: 'rankingDef', orderSequence: ['desc', 'asc'] },
    // obstacles crossing details
    { title: 'Pos.1 X Count', data: 'position1crossings', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'ChevalDeFrise X Count', data: 'A_ChevalDeFrise', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Drawbridge X Count', data: 'C_Drawbridge', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Moat Count X Count', data: 'B_Moat', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Portcullis X Count', data: 'A_Portcullis', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Ramparts X Count', data: 'B_Ramparts', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'RockWall X Count', data: 'D_RockWall', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'RoughTerrain X Count', data: 'D_RoughTerrain', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'SallyPort X Count', data: 'C_SallyPort', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    // other
    { title: 'Auto Reach Points', data: 'autoReachPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Teleop Challenge Points', data: 'teleopChallengePoints', orderSequence: ['desc', 'asc'] },
    { title: 'Teleop Scale Points', data: 'teleopScalePoints', orderSequence: ['desc', 'asc'] },
    { title: 'Teleop Defenses Breached', data: 'teleopDefensesBreached', orderSequence: ['desc', 'asc'] },
    { title: 'Teleop Tower Captured', data: 'teleopTowerCaptured', orderSequence: ['desc', 'asc'] },
    { title: 'Breach Points', data: 'breachPoints', orderSequence: ['desc', 'asc'] },
    { title: 'CapturePoints', data: 'capturePoints', orderSequence: ['desc', 'asc'] },
    { title: 'Tower End Strength', data: 'towerEndStrength', orderSequence: ['desc', 'asc'] },
    { title: 'Adjust Points', data: 'adjustPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Foul Points', data: 'foulPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Foul Count', data: 'foulCount', orderSequence: ['desc', 'asc'] },
    { title: 'Tech Foul Count', data: 'techFoulCount', orderSequence: ['desc', 'asc'] }
  ] 
};

// ------------------------------------------------------------------------
// Configuration - For the team-details view
// ------------------------------------------------------------------------
var app_team_details_config = {
  summary_panel: [
    { id: 'rankingPlayed', title: 'Matches Played', display_order: 1 },
    { id: 'view_pointsPerMatch', title: 'Points/Match', decimal_places: 2, display_order: 2 },
    { id: 'ranking', title: 'Rank', display_order: 3 },
    { id: 'rankingScore', title: 'Ranking Score', display_order: 4 },
    { id: 'rankingScaleChallenge', title: 'Scale/Challenge', display_order: 5 },
    { id: 'rankingGoals', title: 'Goals', display_order: 6 },
    { id: 'oprs', title: 'OPRS', tooltip: 'Offensive Power Rating: expected points contribution per match', decimal_places: 2, display_order: 7 },
    { id: 'ccwms', title: 'CCWMS', tooltip: 'Calculated Contribution to Winning Margin', decimal_places: 2, display_order: 8 },
    { id: 'dprs', title: 'DPRS', tooltip: 'Defensive Power Rating', decimal_places: 2, display_order: 9 }
  ],
  scoring_viz: [
    { id: 'totalPoints', title: 'Total Points', display_order: 1, visible: true }, 
    { id: 'teleopPoints', title: 'Teleop Points', display_order: 2, visible: true }, 
    { id: 'teleopBoulderPoints', title: 'Teleop Boulder Points', display_order: 3, visible: true }, 
    { id: 'teleopBouldersHigh', title: 'Teleop High Goals', display_order: 4 }, 
    { id: 'teleopBouldersLow', title: 'Teleop Low Goals', display_order: 5 }, 
    { id: 'teleopCrossingPoints', title: 'Teleop Crossing Points', display_order: 6, visible: true }, 
    { id: 'autoPoints', title: 'Auto Points', display_order: 7, visible: true },
    { id: 'autoBoulderPoints', title: 'Auto Boulder Points', display_order: 8, visible: true }, 
    { id: 'autoBouldersHigh', title: 'Auto High Goals', display_order: 9 }, 
    { id: 'autoBouldersLow', title: 'Auto Low Goals', display_order: 10 }, 
    { id: 'autoCrossingPoints', title: 'Auto Crossing Points', display_order: 11, visible: true }
  ],
  scouting_viz: [
    { id: 'rating_scoring_high_goals_made', title: 'High Goals', display_order: 1, missed_id: 'rating_scoring_high_goals_missed' }, 
    { id: 'rating_scoring_low_goals_made', title: 'Low Goal', display_order: 2, missed_id: 'rating_scoring_low_goals_missed' }, 
    { id: 'rating_scoring_tower_scale_made', title: 'Tower Climb', display_order: 3, missed_id: 'rating_scoring_tower_scale_missed' }, 
    { id: 'rating_obstacle_cheval_de_frise_made', title: 'Cheval', display_order: 4, missed_id: 'rating_obstacle_cheval_de_frise_missed' }
  ]
};

// ------------------------------------------------------------------------
// Configuration - For the scouting reports view
// ------------------------------------------------------------------------
var app_scouting_reports_config = {
  overall: [
    { id: 'rating_overall_gear_efficiency', title: 'Gear Efficiency', defaultValue: 'N/A' },
    { id: 'rating_overall_gear_efficiency_auto', title: 'Gear Efficiency Auto', defaultValue: 'N/A' },
    { id: 'rating_overall_robot_stability', title: 'Robot Stability', defaultValue: 'N/A' },
  ],
  cols: [
    {
      header_title: 'Teleoperated', 
      col_data: [
        { id: 'rating_scoring_high_goals_made', title: 'High Goals', defaultValue: '0' },
        { id: 'rating_scoring_low_goals_made', title: 'Low Goals', defaultValue: '0' },
        { id: 'rating_scoring_gears_made', title: 'Gears', defaultValue: '0' },
        { id: 'rating_scoring_airship_climb', title: 'Climbing', defaultValue: 'N/A' },
      ]
    },
    {
      header_title: 'Autonomous', 
      col_data: [
        { id: 'rating_scoring_high_goals_made_auto', title: 'High Goals', defaultValue: '0' },
        { id: 'rating_scoring_low_goals_made_auto', title: 'Low Goals', defaultValue: '0' },
        { id: 'rating_scoring_gears_made_auto', title: 'Gears', defaultValue: '0' },
        { id: 'rating_scoring_base_line_made_auto', title: 'Cross Base Line', defaultValue: 'N/A' },
      ]
    },
  ]
}

// ------------------------------------------------------------------------
// Configuration - For the team-details view
// ------------------------------------------------------------------------
var app_match_intel_config = {
  summary_panel: [
    { id: 'oprs', title: 'OPRS', tooltip: 'Offensive Power Rating: expected points contribution per match', decimal_places: 2 },
    { id: 'ccwms', title: 'CCWMS', tooltip: 'Calculated Contribution to Winning Margin', decimal_places: 2 },
    { id: 'avgPoints', title: 'Avg.', calc_type: 'avg', agg:['totalPoints'], decimal_places: 2 }
  ],
  match_stats: [
    { id: 'avgHighGoals', title: 'Avg. High Goals', calc_type: 'avg', agg:['autoBouldersHigh', 'teleopBouldersHigh'] }, 
    { id: 'avgLowGoals', title: 'Avg. Low Goals', calc_type: 'avg', agg:['autoBouldersLow', 'teleopBouldersLow'] }, 
    { id: 'avgCrossingPoints', title: 'Avg. Crossing Points', calc_type: 'avg', agg:['autoCrossingPoints', 'teleopCrossingPoints'] }, 
    { id: 'avgChallengeScalePoints', title: 'Avg. Challenge/Scale Points', calc_type: 'avg', agg:['teleopChallengePoints', 'teleopScalePoints'] }
  ],
  team_stats: [
    { id: 'avgRobotStability', title: 'Robot Stability', calc_type: 'avg', agg:['rating_overall_robot_stability'], min: 1, max: 5 }, 
    { id: 'accHighGoals', title: 'High Goal Accuracy',calc_type: 'accuracy',  made_ids: ['rating_scoring_high_goals_made'], missed_ids: ['rating_scoring_high_goals_missed'] }, 
    { id: 'accLowGoals', title: 'Low Goal Accuracy',calc_type: 'accuracy',  made_ids: ['rating_scoring_low_goals_made'], missed_ids: ['rating_scoring_low_goals_missed'] }, 
    { id: 'accScale', title: 'Scale Accuracy', calc_type: 'accuracy',  made_ids: ['rating_scoring_tower_scale_made'], missed_ids: ['rating_scoring_tower_scale_missed'] }
  ],
  strengths_weaknesses_stats : [
    { id: 'avgRobotStability', title: 'Robot Stability', calc_type: 'avg', agg:['rating_overall_robot_stability'], min: 1, max: 5 }, 
    { id: 'accHighGoals', title: 'High Goal Accuracy',calc_type: 'accuracy',  made_ids: ['rating_scoring_high_goals_made'], missed_ids: ['rating_scoring_high_goals_missed'] }, 
    { id: 'accLowGoals', title: 'Low Goal Accuracy',calc_type: 'accuracy',  made_ids: ['rating_scoring_low_goals_made'], missed_ids: ['rating_scoring_low_goals_missed'] }, 
    { id: 'accScale', title: 'Scale Accuracy', calc_type: 'accuracy',  made_ids: ['rating_scoring_tower_scale_made'], missed_ids: ['rating_scoring_tower_scale_missed'] }
  ]
};