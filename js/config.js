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
    id: 'xTotalOwnershipPoints',
    title: 'Ownership Points',
    dtype: 'int',
    scoring_type: 'sum',
    tbaFields: ['autoOwnershipPoints', 'teleopOwnershipPoints']
  },{
    id: 'xTotalSwitchOwnershipSec',
    title: 'Switch Ownership Seconds',
    dtype: 'int',
    scoring_type: 'sum',
    tbaFields: ['autoSwitchOwnershipSec', 'teleopSwitchOwnershipSec', 'teleopSwitchBoostSec']
  }, {
    id: 'xTotalScaleOwnershipSec',
    title: 'Scalse Ownership Seconds',
    dtype: 'int',
    scoring_type: 'sum',
    tbaFields: ['autoScaleOwnershipSec', 'teleopScaleOwnershipSec', 'teleopScaleBoostSec']
  }, {
    id: 'xLeftOverLevitateCubes',
    title: 'Unused Levitate Cubes',
    dtype: 'int',
    scoring_type: 'diff',
    tbaFields: ['vaultLevitateTotal', 'vaultLevitatePlayed']
  }, {
    id: 'xLeftOverBoostCubes',
    title: 'Unused Boost Cubes',
    dtype: 'int',
    scoring_type: 'diff',
    tbaFields: ['vaultBoostTotal', 'vaultBoostPlayed']
  }, {
    id: 'xLeftOverForceCubes',
    title: 'Unused Force Cubes',
    dtype: 'int',
    scoring_type: 'diff',
    tbaFields: ['vaultForceTotal', 'vaultForcePlayed']
  }, {
    id: 'xEndGameClimbs',
    title: 'EndGame Climbs',
    dtype: 'str',
    scoring_type: 'count',
    tbaFields: ['endgameRobot1', 'endgameRobot2', 'endgameRobot3'],
    tbaValue: 'Climbing'
  }, {
    id: 'xEndGameParks',
    title: 'EndGame Parks',
    dtype: 'str',
    scoring_type: 'count',
    tbaFields: ['endgameRobot1', 'endgameRobot2', 'endgameRobot3'],
    tbaValue: 'Parking'
  }, {
    id: 'xEndGameLevitates',
    title: 'EndGame Levitates',
    dtype: 'str',
    scoring_type: 'count',
    tbaFields: ['endgameRobot1', 'endgameRobot2', 'endgameRobot3'],
    tbaValue: 'Levitate'
  }, {
    id: 'xAutoRobotRuns',
    title: 'Auto Runs',
    dtype: 'str',
    scoring_type: 'count',
    tbaFields: ['autoRobot1', 'autoRobot2', 'autoRobot3'],
    tbaValue: 'AutoRun'
  }];
  // { keeping this in here so we remember we can do reassigns
  //   id: 'position2',
  //   title: 'Position Two',
  //   dtype: 'int',
  //   scoring_type: 'reassign_value',
  //   reassign_value_to: 'position2crossings'
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
    { data: 'rp', title: 'Ranking Points', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { data: 'tba_rpEarned', title: 'Winning Rps', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
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
    //Auto Mobility
    { title: 'Auto Run Counts(Match)', data: 'xAutoRobotRuns', orderSequence: ['desc', 'asc'] },

    // switch/scale details
    { title: 'Auto Switch Seconds', data: 'autoSwitchOwnershipSec', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Teleop Switch Seconds', data: 'teleopSwitchOwnershipSec', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Switch Boost Seconds', data: 'teleopSwitchBoostSec', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Switch Force Seconds', data: 'teleopSwitchForceSec', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Auto Scale Seconds', data: 'autoScaleOwnershipSec', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Teleop Scale Seconds', data: 'teleopScaleOwnershipSec', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Scale Boost Seconds', data: 'teleopScaleBoostSec', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Scale Force Seconds', data: 'teleopScaleForceSec', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    // vault and powerup details
    { title: 'Vault Total', data: 'vaultPoints', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Levitate Total', data: 'vaultLevitateTotal', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Levitate Played', data: 'vaultLevitatePlayed', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Boost Total', data: 'vaultBoostTotal', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Boost Played', data: 'vaultBoostPlayed', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'Force Total', data: 'vaultForceTotal', orderSequence: ['desc', 'asc'], defaultContent: 0, visible: false },
    { title: 'Force Played', data: 'vaultForcePlayed', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    // endgame details
    { title: 'EndGame Climbs', data: 'xEndGameClimbs', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'EndGame Parks', data: 'xEndGameParks', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    { title: 'EndGame Levitates', data: 'xEndGameLevitates', orderSequence: ['desc', 'asc'], defaultContent: 0 },
    // other ranking info
    { title: 'Auto Quest Ranking Point', data: 'autoQuestRankingPoint', orderSequence: ['desc', 'asc'] },
    { title: 'Face the Boss Ranking Point', data: 'faceTheBossRankingPoint', orderSequence: ['desc', 'asc'] },
    // foul Points
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
    { id: 'rankingOwnership', title: 'Ownership', display_order: 4, arr_index: 3 },
    { id: 'rankingVault', title: 'Vault', display_order: 5, arr_index: 4 },
    { id: 'rankingParkClimbPoints', title: 'Park/Climb', display_order: 6, arr_index: 1 },
    { id: 'oprs', title: 'OPRS', tooltip: 'Offensive Power Rating: expected points contribution per match', decimal_places: 2, display_order: 8 },
    { id: 'ccwms', title: 'CCWMS', tooltip: 'Calculated Contribution to Winning Margin', decimal_places: 2, display_order: 9 },
    { id: 'dprs', title: 'DPRS', tooltip: 'Defensive Power Rating', decimal_places: 2, display_order: 10 }
  ],
  scoring_viz: [
    { id: 'totalPoints', title: 'Total Points', display_order: 1 }, 
    { id: 'teleopPoints', title: 'Points (teleop)', display_order: 2 }, 
    { id: 'autoPoints', title: 'Points (auto)', display_order: 3 },
    { id: 'endgamePoints', title: ' End Game (teleop)', display_order: 4, visible: true },
    { id: 'vaultPoints', title: ' Vault Ponts (teleop)', display_order: 5 },
    { id: 'xTotalOwnershipPoints', title: ' Ownership Points', display_order: 6, visible: true }, 
    { id: 'xTotalSwitchOwnershipSec', title: 'Switch Ownership Sec', display_order: 7, visible: true },
    { id: 'xTotalScaleOwnershipSec', title: 'Scale Ownership Sec', display_order: 8, visible: true }, 
    { id: 'autoRunPoints', title: 'CROSSING Points (auto)', display_order: 9 },

    { id: 'teleopSwitchOwnershipSec', title: 'Switch Ownership (teleop)', display_order: 10 }, 
    { id: 'autoSwitchOwnershipSec', title: 'Switch Ownership (auto)', display_order: 11 }, 

    { id: 'teleopScaleOwnershipSec', title: 'Scale Ownership (teleop)', display_order: 12 }, 
    { id: 'autoScaleOwnershipSec', title: 'Scale Ownership (auto)', display_order: 13 }, 

    { id: 'vaultBoostPlayed', title: 'Boost Played (teleop)', display_order: 14 },
    { id: 'vaultForcePlayed', title: 'Force Played (teleop)', display_order: 15 },
    { id: 'vaultLevitatePlayed', title: 'Levitate Played (auto)', display_order: 16 }, 
        
  ],
  scouting_viz: [
    { id: 'rating_scoring_boxes_on_switch_auto', title: 'Avg. Boxes on Switch (auto)', missed_id: '', calc_type: 'avg' }, 
    { id: 'rating_scoring_boxes_on_scale_auto', title: 'Avg. Boxes on Scale (auto)', missed_id: '', calc_type: 'avg' }, 
    { id: 'rating_scoring_base_line_made_auto', title: 'Avg. Mobility Counts', missed_id: '', calc_type: 'avg' }, 

    { id: 'rating_scoring_boxes_on_switch', title: 'Avg. Boxes on Switch (teleop)', missed_id: '', calc_type: 'avg' }, 
    { id: 'rating_scoring_boxes_on_scale', title: 'Avg. Boxes on Scale (teleop)', missed_id: '', calc_type: 'avg' }, 
    
    { id: 'rating_scoring_cubes_exchanged', title: 'Avg. Cubes Exchanged (teleop)', missed_id: '', calc_type: 'avg' },
    { id: 'rating_overall_switch_efficiency', title: 'Avg. Switch Efficiency (1-5)', missed_id: '', calc_type: 'avg' },
    { id: 'rating_overall_scale_efficiency', title: 'Avg. Scale Efficiency (1-5)', missed_id: '', calc_type: 'avg' },
    { id: 'rating_overall_exchange_efficiency', title: 'Avg. Exchange Efficiency (1-5)', missed_id: '', calc_type: 'avg' },
    { id: 'rating_scoring_park', title: 'Avg. Park (0-1)', missed_id: '', calc_type: 'avg' },
    { id: 'rating_scoring_climb', title: 'Avg. Climb (0-1)', missed_id: '', calc_type: 'avg' },
    { id: 'rating_scoring_number_of_robots_lifted', title: 'Avg. # of Robots Lifted (0-3)', missed_id: '', calc_type: 'avg' },
    { id: 'rating_overall_robot_stability', title: 'Avg. Robot Stability (1-5)', missed_id: '', calc_type: 'avg' },
  ],
  scouting_viz_series: {  made_title: 'Made', missed_title: 'Missed' }
};

// ------------------------------------------------------------------------
// Configuration - For the scouting reports view
// ------------------------------------------------------------------------
var app_scouting_reports_config = {
  overall: [
    { id: 'rating_overall_robot_stability', title: 'Robot Stability', defaultValue: 'N/A' },
    { id: 'rating_overall_switch_efficiency', title: 'Switch Efficiency', defaultValue: 'N/A' },
    { id: 'rating_overall_scale_efficiency', title: 'Scale Efficiency', defaultValue: 'N/A' },
    { id: 'rating_overall_exchange_efficiency', title: 'Exchange Efficiency', defaultValue: 'N/A' },
  ],
  cols: [
    {
      header_title: 'Teleoperated', 
      col_data: [
        { id: 'rating_scoring_boxes_on_switch', title: 'Boxes on Switch', defaultValue: '0' },
        { id: 'rating_scoring_boxes_on_scale', title: 'Boxes on Scale', defaultValue: '0' },
        { id: 'rating_scoring_cubes_exchanged', title: 'Cubes Exchanged', defaultValue: '0' },
        { id: 'rating_scoring_park', title: 'Parking', defaultValue: '0' },
        { id: 'rating_scoring_climb', title: 'Climbing', defaultValue: '0' },
        { id: 'rating_scoring_number_of_robots_lifted', title: '# of Robots Lifted', defaultValue: '0' },
      ]
    },
    {
      header_title: 'Autonomous', 
      col_data: [
        { id: 'rating_scoring_boxes_on_switch_auto', title: 'Boxes on Switch', defaultValue: '0' },
        { id: 'rating_scoring_boxes_on_scale_auto', title: 'Boxes on Scale', defaultValue: '0' },
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
    { id: 'oprs', title: 'OPR', tooltip: 'Offensive Power Rating: expected points contribution per match', decimal_places: 2 },
    { id: 'ccwms', title: 'CCWM', tooltip: 'Calculated Contribution to Winning Margin', decimal_places: 2 },
    { id: 'avgPoints', title: 'Avg.', calc_type: 'avg', agg:['totalPoints'], decimal_places: 2 }
  ],
  match_stats: [
    { id: 'avgOwnershipPoints', title: 'AVG. OWNERSHIP POINTS', calc_type: 'avg', agg:['xTotalOwnershipPoints'] , css:'ps-match-intel-score-section' },
    { id: 'avgSwitchOwnershipSec', title: 'Avg. Switch Ownership Sec', calc_type: 'avg', agg:['xTotalSwitchOwnershipSec'] },
    { id: 'avgScaleOwnershipSec', title: 'Avg. Scale Ownership Sec', calc_type: 'avg', agg:['xTotalScaleOwnershipSec'] }, 

    { id: 'avgEndGamePoints', title: 'AVG. END GAME POINTS', calc_type: 'avg', agg:[ 'endgamePoints'], css:'ps-match-intel-score-section' }, 
    { id: 'avgEndGameClimbs', title: 'Avg. End Game Climbs', calc_type: 'avg', agg:[ 'xEndGameClimbs'] }, 
    { id: 'avgEndGameParks', title: 'Avg. End Game Parks', calc_type: 'avg', agg:[ 'xEndGameParks'] }, 
    { id: 'avgEndGameLevitates', title: 'Avg. End Game Levitates', calc_type: 'avg', agg:[ 'xEndGameLevitates'] },

    { id: 'avgVaultPoints', title: 'AVG. VAULT POINTS', calc_type: 'avg', agg:['vaultPoints'], css:'ps-match-intel-score-section' },
    { id: 'avgLevitatePlayed', title: 'Avg. Levitate Played', calc_type: 'avg', agg:['vaultLevitatePlayed'] },
    { id: 'avgBoostPlayed', title: 'Avg. Boost Played', calc_type: 'avg', agg:['vaultBoostPlayed'] },
    { id: 'avgForcePlayed', title: 'Avg. Force Played', calc_type: 'avg', agg:['vaultForcePlayed'] },

    { id: 'avgAutoPoints', title: 'Avg. AUTO POINTS', calc_type: 'avg', agg:['autoPoints'], css:'ps-match-intel-score-section' },
    { id: 'avgAutoRunCount', title: 'Avg. Auto Run Counts', calc_type: 'avg', agg:['xAutoRobotRuns'] },
  ],
  team_stats: [
    { id: 'avgRobotStability', title: 'Robot Stability', calc_type: 'avg', agg:['rating_overall_robot_stability'], min: 1, max: 5 }, 

    { id: 'avgBoxesOnSwitch', title: 'AVG. BOXES ON SWITCH',calc_type: 'avg', agg:['rating_scoring_boxes_on_switch', 'rating_scoring_boxes_on_switch_auto'], css:'ps-match-intel-score-section' },   
    { id: 'avgBoxesOnSwitchAuto', title: 'Avg. Boxes on Switch (auto)',calc_type: 'avg', agg:['rating_scoring_boxes_on_switch_auto'] }, 
    { id: 'avgSwitchEff', title: 'Avg. Switch Efficiency',calc_type: 'avg', agg:['rating_overall_switch_efficiency'], min: 1, max: 5 },

    { id: 'avgBoxesOnScale', title: 'AVG. BOXES ON SCALE',calc_type: 'avg', agg:['rating_scoring_boxes_on_scale', 'rating_scoring_boxes_on_scale_auto'], css:'ps-match-intel-score-section'  },  
    { id: 'avgBoxesOnScaleAuto', title: 'Avg. Boxes on Scale (auto)',calc_type: 'avg', agg:['rating_scoring_boxes_on_scale_auto'] },  
    { id: 'avgScaleEff', title: 'Avg. Scale Efficiency',calc_type: 'avg', agg:['rating_overall_scale_efficiency'] , min: 1, max: 5},
    
    { id: 'avgBoxesExchanged', title: 'AVG. CUBES EXCHANGED (teleop)',calc_type: 'avg', agg:['rating_scoring_cubes_exchanged'], css:'ps-match-intel-score-section'  },   
    { id: 'avgExchangeEff', title: 'Avg. Exchange Efficiency',calc_type: 'avg', agg:['rating_overall_exchange_efficiency'], min: 1, max: 5 },
   
    { id: 'avgParking', title: 'Parking Probablity', calc_type: 'avg', agg:['rating_scoring_park'], min: 0, max: 1, css:'ps-match-intel-score-section'  }, 
    { id: 'avgClimbing', title: 'Climbing Probablity', calc_type: 'avg', agg:['rating_scoring_climb'], min: 0, max: 1 }, 
    { id: 'avgRobotsLifted', title: 'Avg. # of Robots Lifted', calc_type: 'avg', agg:['rating_scoring_number_of_robots_lifted'], min: 0, max: 3 },

    { id: 'avgMobility', title: 'Mobility Probability', calc_type: 'avg', agg:['rating_scoring_base_line_made_auto'], min: 0, max: 1, css:'ps-match-intel-score-section'  }
  ],
  strengths_weaknesses_stats : [
    { id: 'avgBoxesOnSwitch', title: 'Avg. Boxes on Switch',calc_type: 'avg', agg:['rating_scoring_boxes_on_switch', 'rating_scoring_boxes_on_switch_auto'] },
    { id: 'avgBoxesOnSwitchAuto', title: 'Avg. Boxes on Switch (auto)',calc_type: 'avg', agg:['rating_scoring_boxes_on_switch_auto'] },  
    { id: 'avgSwitchEff', title: 'Avg. Switch Eff',calc_type: 'avg', agg:['rating_overall_switch_efficiency'], min: 1, max: 5 },

    { id: 'avgBoxesOnScale', title: 'Avg. Boxes on Scale',calc_type: 'avg', agg:['rating_scoring_boxes_on_scale', 'rating_scoring_boxes_on_scale_auto'] },
    { id: 'avgScaleEff', title: 'Avg. Scale Eff',calc_type: 'avg', agg:['rating_overall_scale_efficiency'], min: 1, max: 5 },
    { id: 'avgBoxesOnScaleAuto', title: 'Avg. Boxes on Scale (auto)',calc_type: 'avg', agg:['rating_scoring_boxes_on_scale_auto'] }, 

    { id: 'avgBoxesExchanged', title: 'Avg. Boxes on Exchange',calc_type: 'avg', agg:['rating_scoring_boxes_on_exchange'] },
    { id: 'avgExchangeEff', title: 'Avg. Exchange Eff',calc_type: 'avg', agg:['rating_overall_exchange_efficiency'], min: 1, max: 5 },

    { id: 'avgParking', title: 'Parking %', calc_type: 'avg', agg:['rating_scoring_park'], min: 0, max: 1 },
    { id: 'avgClimbing', title: 'Climbing %', calc_type: 'avg', agg:['rating_scoring_climb'], min: 0, max: 1 },
    { id: 'avgRobotsLifted', title: '# of Robots Lifted %', calc_type: 'avg', agg:['rating_scoring_number_of_robots_lifted'], min: 0, max: 3 },
    
    { id: 'avgMobility', title: 'Mobility %', calc_type: 'avg', agg:['rating_scoring_base_line_made_auto'], min: 0, max: 1 }

    // { id: 'accScale', title: 'Scale Accuracy', calc_type: 'accuracy',  made_ids: ['rating_scoring_tower_scale_made'], missed_ids: ['rating_scoring_tower_scale_missed'] }
  ]
};