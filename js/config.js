// ------------------------------------------------------------------------
// Configuration - For data fetched via TBA
// ------------------------------------------------------------------------
var tba_api_ranking_config = [
  { id: 'ranking', title: 'Rank', display_order: 1, key: 'rank' },
  { id: 'rankingScore', title: 'Ranking Score', display_order: 2, arr_index: 0 },
  { id: 'rankingParkClimbPoints', title: 'Park/Climb Points', display_order: 3, arr_index: 1 },
  { id: 'rankingAuto', title: 'Auto', display_order: 4, arr_index: 2 },
  { id: 'rankingOwnership', title: 'Ownership', display_order: 5, arr_index: 3 },
  { id: 'rankingVault', title: 'Vault', display_order: 6, arr_index: 4 },
  { id: 'rankingRecord', title: 'Record (W-L-T)', display_order: 8, key: 'record'},
  { id: 'rankingPlayed', title: 'Played', display_order: 9, key: 'matches_played' }
];

var tba_api_scoring_config = [
  {
    id: 'xTotalSwitchOwnershipSec',
    title: 'Switch Ownership Seconds',
    dtype: 'int',
    agg: ['autoSwitchOwnershipSec', 'teleopSwitchOwnershipSec', 'teleopSwitchBoostSec']
  }, {
    id: 'xLeftOverForceCubes',
    title: 'Unused Force Cubes',
    dtype: 'int',
    subtraction: ['vaultForceTotal', 'vaultForcePlayed']
  }, {
    id: 'xTotalScaleOwnershipSec',
    title: 'Scalse Ownership Seconds',
    dtype: 'int',
    agg: ['autoScaleOwnershipSec', 'teleopScaleOwnershipSec', 'teleopScaleBoostSec']
  }, {
    id: 'xLeftOverBoostCubes',
    title: 'Unused Boost Cubes',
    dtype: 'int',
    subtraction: ['vaultBoostTotal', 'vaultBoostPlayed']
  }, {
    id: 'xLeftOverLevitateCubes',
    title: 'Unused Levitate Cubes',
    dtype: 'int',
    subtraction: ['vaultLevitateTotal', 'vaultLevitatePlayed']
  }];
  // { keeping this in here so we remember we can do substitutions
  //   id: 'position2',
  //   title: 'Position Two',
  //   dtype: 'int',
  //   substitution: 'position2crossings'
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
      data: 'dprs', title: 'DPRS', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false,
      render: function (data) { return Math.round(data * 100) / 100; }
    },
    // aggregated category points/counts
    { title: 'TOTAL POINTS', data: 'totalPoints', orderSequence: ['desc', 'asc'] },
    { title: 'TELEOP Points', data: 'teleopPoints', orderSequence: ['desc', 'asc'], visible: false },
    { title: 'AUTO Points', data: 'autoPoints', orderSequence: ['desc', 'asc'], visible: false },
    { title: 'SWITCH Seconds', data: 'xTotalSwitchOwnershipSec', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'SCALE Seconds', data: 'xTotalScaleOwnershipSec', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'ENDGAME Points', data: 'endgamePoints', orderSequence: ['desc', 'asc'] },
    { title: 'CROSSING Points (auto)', data: 'autoRunPoints', orderSequence: ['desc', 'asc'] },
    // Switch/Scale details
    { title: 'Auto Switch Seconds', data: 'autoSwitchOwnershipSec', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Teleop Switch Seconds', data: 'teleopSwitchOwnershipSec', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Switch Boost Seconds', data: 'teleopSwitchBoostSec', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Switch Force Seconds', data: 'teleopSwitchForceSec', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Auto Scale Seconds', data: 'autoScaleOwnershipSec', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Teleop Scale Seconds', data: 'teleopScaleOwnershipSec', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Scale Boost Seconds', data: 'teleopScaleBoostSec', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Scale Force Seconds', data: 'teleopScaleForceSec', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Vault Total', data: 'vaultPoints', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Levitate Total', data: 'vaultLevitateTotal', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Levitate Played', data: 'vaultLevitatePlayed', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Boost Total', data: 'vaultBoostTotal', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Boost Played', data: 'vaultBoostPlayed', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Force Total', data: 'vaultForceTotal', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Force Played', data: 'vaultForcePlayed', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    // other ranking info
    { title: 'Rotor Ranking Points', data: 'rotorRankingPointAchieved', orderSequence: ['desc', 'asc'] },
    { title: 'Rotor Bonus Points', data: 'rotorBonusPoints', orderSequence: ['desc', 'asc'] },
    { title: 'Fuel Ranking Points', data: 'kPaRankingPointAchieved', orderSequence: ['desc', 'asc'] },
    { title: 'Fuel Bonus Points', data: 'kPaBonusPoints', orderSequence: ['desc', 'asc'] },
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
    { id: 'Pressure', title: 'Pressure', display_order: 6, arr_index: 7 },
    { id: 'oprs', title: 'OPRS', tooltip: 'Offensive Power Rating: expected points contribution per match', decimal_places: 2, display_order: 8 },
    { id: 'ccwms', title: 'CCWMS', tooltip: 'Calculated Contribution to Winning Margin', decimal_places: 2, display_order: 9 },
    { id: 'dprs', title: 'DPRS', tooltip: 'Defensive Power Rating', decimal_places: 2, display_order: 10 }
  ],
  scoring_viz: [
    { id: 'totalPoints', title: 'Total Points', display_order: 1 }, 
    { id: 'teleopPoints', title: 'Points (teleop)', display_order: 2 }, 
    { id: 'autoPoints', title: 'Points (auto)', display_order: 3 },
    { id: 'xTotalRotorPoints', title: ' Rotor Points', display_order: 4, visible: true }, 
    { id: 'xTotalFuelPoints', title: 'Fuel Points', display_order: 5, visible: true },
    { id: 'teleopTakeoffPoints', title: 'Takeoff Points (teleop)', display_order: 6, visible: true }, 
    { id: 'autoMobilityPoints', title: 'Auto Mobility Points (auto)', display_order: 7, visible: true },

    { id: 'teleopRotorPoints', title: 'Rotor Points (teleop)', display_order: 8 }, 
    { id: 'autoRotorPoints', title: 'Rotor Points (auto)', display_order: 9 }, 

    { id: 'teleopFuelPoints', title: 'Fuel Points (teleop)', display_order: 10 }, 
    { id: 'autoFuelPoints', title: 'Fuel Points (auto)', display_order: 11 }, 

    { id: 'teleopFuelHigh', title: 'High Goals (teleop)', display_order: 12 },
    { id: 'teleopFuelLow', title: 'Low Goals (teleop)', display_order: 13 },
    { id: 'autoFuelsHigh', title: 'High Fuels (auto)', display_order: 14 }, 
    { id: 'autoFuelsLow', title: 'Low Fuels (auto)', display_order: 15 }
    
  ],
  scouting_viz: [
    { id: 'rating_scoring_gears_made', title: 'Avg. Gears (teleop)', missed_id: '', calc_type: 'avg' }, 
    { id: 'rating_scoring_gears_made_auto', title: 'Avg. Gears (auto)', missed_id: '', calc_type: 'avg' }, 
    { id: 'rating_overall_gear_placement_auto', title: 'Side Gear Placement (auto)', missed_id: '', calc_type: 'avg' }, 

    { id: 'rating_scoring_high_goals_made', title: 'Avg. High Goals (teleop)', missed_id: '', calc_type: 'avg' }, 
    { id: 'rating_scoring_high_goals_made_auto', title: 'Avg. High Goals (auto)', missed_id: '', calc_type: 'avg' }, 
    
    { id: 'rating_scoring_airship_climb', title: 'Takeoff Counts', missed_id: '', calc_type: 'total' },
    { id: 'rating_scoring_base_line_made_auto', title: 'Mobility Counts', missed_id: '', calc_type: 'total' },
    { id: 'rating_overall_robot_stability', title: 'Avg. Stability (1-5)', missed_id: '', calc_type: 'avg' },
    { id: 'rating_overall_pilot_competency', title: 'Avg. Pilot Competency (1-5)', missed_id: '', calc_type: 'avg' }
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
    { id: 'rating_overall_gear_placement_auto', title: 'Side Gear Placement Auto', defaultValue: 'N/A' },
    { id: 'rating_overall_robot_stability', title: 'Robot Stability', defaultValue: 'N/A' },
    { id: 'rating_overall_pilot_competency', title: 'Pilot Competency', defaultValue: 'N/A' },
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
    { id: 'avgFuelPointsAuto', title: 'Avg. Fuel Points (auto)', calc_type: 'avg', agg:['autoFuelPoints'] },
    { id: 'avgTakeOffPonts', title: 'Avg. Takeoff Points', calc_type: 'avg', agg:['teleopTakeoffPoints'] }
  ],
  team_stats: [
    { id: 'avgRobotStability', title: 'Robot Stability', calc_type: 'avg', agg:['rating_overall_robot_stability'], min: 1, max: 5 }, 
    { id: 'avgPilotCompetency', title: 'Pilot Competency', calc_type: 'avg', agg:['rating_overall_pilot_competency'], min: 1, max: 5 }, 
    { id: 'avgGearEff', title: 'Gear Efficiency',calc_type: 'avg', agg:['rating_overall_gear_efficiency', 'rating_overall_gear_efficiency_auto'], min: 1, max: 5 },
    { id: 'avgGearsMade', title: 'Avg. Gears',calc_type: 'avg', agg:['rating_scoring_gears_made', 'rating_scoring_gears_made_auto'] },
    { id: 'avgGearsMadeAuto', title: 'Avg. Gears (auto)',calc_type: 'avg', agg:['rating_scoring_gears_made_auto'] },
    { id: 'avgGearPlacementAuto', title: 'Side Gear Placement (auto)',calc_type: 'avg', agg:['rating_overall_gear_placement_auto'] },
   
    { id: 'avgHighGoals', title: 'Avg. High Goals',calc_type: 'avg', agg:['rating_scoring_high_goals_made_auto', 'rating_scoring_high_goals_made'] },  
    { id: 'avgHighGoalsAuto', title: 'Avg. High Goals (auto)',calc_type: 'avg', agg:['rating_scoring_high_goals_made_auto'] }, 

    { id: 'avgClimbing', title: 'Climbing Probablity', calc_type: 'avg', agg:['rating_scoring_airship_climb'], min: 0, max: 1 }, 
    { id: 'avgMobility', title: 'Mobility Probability', calc_type: 'avg', agg:['rating_scoring_base_line_made_auto'], min: 0, max: 1 } 
  ],
  strengths_weaknesses_stats : [
    { id: 'avgGearsMade', title: 'Avg. Gears',calc_type: 'avg', agg:['rating_scoring_gears_made', 'rating_scoring_gears_made_auto'] },
    { id: 'avgGearEff', title: 'Gear Efficiency',calc_type: 'avg', agg:['rating_overall_gear_efficiency', 'rating_overall_gear_efficiency_auto'], min: 1, max: 5 },
    { id: 'avgGearsMadeAuto', title: 'Avg. Gears (auto)',calc_type: 'avg', agg:['rating_scoring_gears_made_auto'] },
   
    { id: 'avgHighGoals', title: 'Avg. High Goals',calc_type: 'avg', agg:['rating_scoring_high_goals_made_auto', 'rating_scoring_high_goals_made'] },  
    { id: 'avgHighGoalsAuto', title: 'Avg. High Goals (auto)',calc_type: 'avg', agg:['rating_scoring_high_goals_made_auto'] }, 

    { id: 'avgClimbing', title: 'Climbing %', calc_type: 'avg', agg:['rating_scoring_airship_climb'], min: 0, max: 1 }, 
    { id: 'avgMobility', title: 'Mobility %', calc_type: 'avg', agg:['rating_scoring_base_line_made_auto'], min: 0, max: 1 } 
    // { id: 'accScale', title: 'Scale Accuracy', calc_type: 'accuracy',  made_ids: ['rating_scoring_tower_scale_made'], missed_ids: ['rating_scoring_tower_scale_missed'] }
  ]
};