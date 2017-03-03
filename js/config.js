// ------------------------------------------------------------------------
// Configuration - For data fetched via TBA
// ------------------------------------------------------------------------
var tba_api_ranking_config = [
  { id: 'ranking', title: 'Rank', display_order: 1, arr_index: 0 },
  { id: 'rankingScore', title: 'Ranking Score', display_order: 2, arr_index: 2 },
  { id: 'rankingMatchPoints', title: 'Match Points', display_order: 2, arr_index: 3 },
  { id: 'rankingAuto', title: 'Auto', display_order: 3, arr_index: 4 },
  { id: 'rankingRotor', title: 'Rotor', display_order: 4, arr_index: 5 },
  { id: 'rankingTouchpad', title: 'Touchpad', display_order: 5, arr_index: 6 },
  { id: 'Pressure', title: 'Defense', display_order: 6, arr_index: 7 },
  { id: 'rankingRecord', title: 'Record (W-L-T)', display_order: 7, arr_index: 8 },
  { id: 'rankingPlayed', title: 'Played', display_order: 8, arr_index: 9 }
];

var tba_api_scoring_config = [
  {
    id: 'xTotalRotorsEngaged',
    title: 'Rotors Engaged',
    dtype: 'bool',
    agg: ['rotor1Engaged', 'rotor2Engaged', 'rotor3Engaged', 'rotor4Engaged']
  }, {
    id: 'xTotalRotorPoints',
    title: 'Rotor Points',
    dtype: 'int',
    agg: ['autoRotorPoints', 'teleopRotorPoints']
  }, {
    id: 'xTotalFuelPoints',
    title: 'Fuel Points',
    dtype: 'int',
    agg: ['autoFuelPoints', 'teleopFuelPoints']
  }, {
    id: 'xTotalHighFuels',
    title: 'High Fuels',
    dtype: 'int',
    agg: ['autoFuelHigh', 'teleopFuelHigh']
  }, {
    id: 'xTotalLowFuels',
    title: 'Low Fuels',
    dtype: 'int',
    agg: ['autoFuelLow', 'teleopFuelLow']
  }];
  // { keeping this in here so we remember we can do substitutions
  //   id: 'position2',
  //   title: 'Position Two',
  //   dtype: 'int',
  //   sub: 'position2crossings'
  // }


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
    // aggregated category points/counts
    { data: 'xTotalRotorPoints', title: 'Rotor Points', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { data: 'xTotalRotorsEngaged', title: '# Rotors Engaged', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { data: 'xTotalFuelPoints', title: 'Fuel Points', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { data: 'xTotalHighFuels', title: 'High Fuels', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { data: 'xTotalLowFuels', title: 'Low Fuels', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    // totals
    { title: 'Total Points', data: 'totalPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Teleop Points', data: 'teleopPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Auto Points', data: 'autoPoints', orderSequence: ['desc', 'asc'] },
    // other ranking info
    { title: 'Rotor Ranking Points', data: 'rotorRankingPointAchieved', orderSequence: ['desc', 'asc'] },
    { title: 'Rotor Bonus Points', data: 'rotorBonusPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Fuel Ranking Points', data: 'kPaRankingPointAchieved', orderSequence: ['desc', 'asc'] },
    { title: 'Fuel Bonus Points', data: 'kPaBonusPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Takeoff Points', data: 'teleopTakeoffPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Mobility Points (auto)', data: 'autoMobilityPoints', orderSequence: ['desc', 'asc'] },
    // rotor/fuel details
    { title: 'Auto Rotor Points', data: 'autoRotorPoints', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Teleop Rotor Points', data: 'teleopRotorPoints', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Auto Fuel Points', data: 'autoFuelPoints', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Teleop Fuel Points', data: 'teleopFuelPoints', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Auto Fuel High', data: 'autoFuelHigh', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Teleop Fuel High', data: 'teleopFuelHigh', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Auto Fuel Low', data: 'autoFuelLow', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Teleop Fuel Low', data: 'teleopFuelLow', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    // other
    { title: 'Rotor 1 Engaged', data: 'rotor1Engaged', orderSequence: ['desc', 'asc'] },
    { title: 'Rotor 2 Engaged', data: 'rotor2Engaged', orderSequence: ['desc', 'asc'] },
    { title: 'Rotor 3 Engaged', data: 'rotor3Engaged', orderSequence: ['desc', 'asc'] },
    { title: 'Rotor 4 Engaged', data: 'rotor4Engaged', orderSequence: ['desc', 'asc'] },
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
    { id: 'rankingRotor', title: 'Rotor', display_order: 4, arr_index: 5 },
    { id: 'rankingTouchpad', title: 'Touchpad', display_order: 5, arr_index: 6 },
    { id: 'Pressure', title: 'Defense', display_order: 6, arr_index: 7 },
    { id: 'oprs', title: 'OPRS', tooltip: 'Offensive Power Rating: expected points contribution per match', decimal_places: 2, display_order: 8 },
    { id: 'ccwms', title: 'CCWMS', tooltip: 'Calculated Contribution to Winning Margin', decimal_places: 2, display_order: 9 },
    { id: 'dprs', title: 'DPRS', tooltip: 'Defensive Power Rating', decimal_places: 2, display_order: 10 }
  ],
  scoring_viz: [
    { id: 'totalPoints', title: 'Total Points', display_order: 1, visible: true }, 
    { id: 'teleopPoints', title: 'Teleop Points', display_order: 2, visible: true }, 
    { id: 'teleopRotorPoints', title: 'Teleop Rotor Points', display_order: 3, visible: true }, 
    { id: 'teleopFuelPoints', title: 'Teleop Low Goals', display_order: 5 }, 
    { id: 'teleopFuelHigh', title: 'Teleop Low Goals', display_order: 5 },
    { id: 'teleopFuelLow', title: 'Teleop Low Goals', display_order: 5 },
    { id: 'teleopTakeoffPoints', title: 'Teleop Takeoff Points', display_order: 6, visible: true }, 
    { id: 'autoPoints', title: 'Auto Points', display_order: 7, visible: true },
    { id: 'autoRotorPoints', title: 'Auto Rotor Points', display_order: 4 }, 
    { id: 'autoFuelPoints', title: 'Auto Fuel Points', display_order: 8, visible: true }, 
    { id: 'autoFuelsHigh', title: 'Auto High Fuels', display_order: 9 }, 
    { id: 'autoFuelsLow', title: 'Auto Low Fuels', display_order: 10 }, 
    { id: 'autoMobilityPoints', title: 'Auto Mobility Points', display_order: 11, visible: true }
  ],
  scouting_viz: [
    { id: 'rating_scoring_gears_made', title: 'Gears', display_order: 3, missed_id: '' }, 
    { id: 'rating_scoring_gears_made_auto', title: 'Gears (auto)', display_order: 3, missed_id: '' }, 

    { id: 'rating_scoring_high_goals_made', title: 'High Goals', display_order: 1, missed_id: '' }, 
    { id: 'rating_scoring_high_goals_made_auto', title: 'High Goals (auto)', display_order: 1, missed_id: '' }, 
    { id: 'rating_scoring_low_goals_made', title: 'Low Goals', display_order: 2, missed_id: '' }, 
    { id: 'rating_scoring_low_goals_made_auto', title: 'Low Goals (auto)', display_order: 2, missed_id: '' }, 
    
    { id: 'rating_scoring_airship_climb', title: 'Takeoff (teleop)', display_order: 4, missed_id: '' },
    { id: 'rating_scoring_base_line_made_auto', title: 'Mobility (auto)', display_order: 4, missed_id: '' },
    { id: 'rating_overall_robot_stability', title: 'Stability', display_order: 4, missed_id: '' }
  ],
  scouting_viz_series: {  made_title: 'Made', missed_title: 'Missed' }
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
    { id: 'avgRotorPoints', title: 'Avg. Rotor Points', calc_type: 'avg', agg:['autoRotorPoints', 'teleopRotorPoints'] },
    { id: 'avgRotorPointsAuto', title: 'Avg. Rotor Points (auto)', calc_type: 'avg', agg:['autoRotorPoints'] },
    { id: 'avgRotorsEngaged', title: 'Avg. Rotors Engaged', calc_type: 'avg', agg:['xTotalRotorsEngaged'] }, 
    { id: 'avgFuelPoints', title: 'Avg. Fuel Points', calc_type: 'avg', agg:['autoFuelPoints', 'teleopFuelPoints'] }, 
    { id: 'avgFuelPointsAuto', title: 'Avg. Fuel Points (auto)', calc_type: 'avg', agg:['autoFuelPoints'] }
  ],
  team_stats: [
    { id: 'avgRobotStability', title: 'Robot Stability', calc_type: 'avg', agg:['rating_overall_robot_stability'], min: 1, max: 5 }, 
    { id: 'avgGearsMade', title: 'Avg. Gears',calc_type: 'avg', agg:['rating_scoring_gears_made', 'rating_scoring_gears_made_auto'] },
    { id: 'avgGearEff', title: 'Gear Efficiency',calc_type: 'avg', agg:['rating_overall_gear_efficiency', 'rating_overall_gear_efficiency_auto'], min: 1, max: 5 },
    { id: 'avgGearsMadeAuto', title: 'Avg. Gears (auto)',calc_type: 'avg', agg:['rating_scoring_gears_made_auto'] },
   
    { id: 'avgHighGoals', title: 'Avg. High Goals',calc_type: 'avg', agg:['rating_scoring_high_goals_made_auto', 'rating_scoring_high_goals_made_auto'] },  
    { id: 'avgHighGoalsAuto', title: 'Avg. High Goals (auto)',calc_type: 'avg', agg:['rating_scoring_high_goals_made_auto'] }, 
    { id: 'avgLowGoals', title: 'Avg. Low Goals', calc_type: 'avg', agg:['rating_scoring_low_goals_made_auto', 'rating_scoring_low_goals_made'] }, 
    { id: 'avgLowGoalsAuto', title: 'Avg. Low Goals (auto)', calc_type: 'avg', agg:['rating_scoring_low_goals_made_auto'] },

    { id: 'avgClimbing', title: 'Climbing Accuracy', calc_type: 'avg', agg:['rating_scoring_airship_climb'], min: 0, max: 1 }, 
    { id: 'avgMobility', title: 'Mobility Accuracy', calc_type: 'avg', agg:['rating_scoring_base_line_made_auto'], min: 0, max: 1 } 
  ],
  strengths_weaknesses_stats : [
    { id: 'avgGearsMade', title: 'Avg. Gears',calc_type: 'avg', agg:['rating_scoring_gears_made', 'rating_scoring_gears_made_auto'] },
    { id: 'avgGearEff', title: 'Gear Efficiency',calc_type: 'avg', agg:['rating_overall_gear_efficiency', 'rating_overall_gear_efficiency_auto'], min: 1, max: 5 },
    { id: 'avgGearsMadeAuto', title: 'Avg. Gears (auto)',calc_type: 'avg', agg:['rating_scoring_gears_made_auto'] },
   
    { id: 'avgHighGoals', title: 'Avg. High Goals',calc_type: 'avg', agg:['rating_scoring_high_goals_made_auto', 'rating_scoring_high_goals_made_auto'] },  
    { id: 'avgHighGoalsAuto', title: 'Avg. High Goals (auto)',calc_type: 'avg', agg:['rating_scoring_high_goals_made_auto'] }, 
    { id: 'avgLowGoals', title: 'Avg. Low Goals', calc_type: 'avg', agg:['rating_scoring_low_goals_made_auto', 'rating_scoring_low_goals_made'] }, 
    { id: 'avgLowGoalsAuto', title: 'Avg. Low Goals (auto)', calc_type: 'avg', agg:['rating_scoring_low_goals_made_auto'] },

    { id: 'avgClimbing', title: 'Climbing Accuracy', calc_type: 'avg', agg:['rating_scoring_airship_climb'], min: 0, max: 1 }, 
    { id: 'avgMobility', title: 'Mobility Accuracy', calc_type: 'avg', agg:['rating_scoring_base_line_made_auto'], min: 0, max: 1 } 
    // { id: 'accScale', title: 'Scale Accuracy', calc_type: 'accuracy',  made_ids: ['rating_scoring_tower_scale_made'], missed_ids: ['rating_scoring_tower_scale_missed'] }
  ]
};