var tba_api_ranking_config = [
  { id: 'ranking', title: 'Rank', display_order: 1, arr_index: 0},
  { id: 'rankingScore', title: 'Ranking Score', display_order: 2, arr_index: 2},
  { id: 'rankingAuto', title: 'Auto', display_order: 3, arr_index: 3},
  { id: 'rankingScaleChallenge', title: 'Scale/Chal', display_order: 4, arr_index: 4},
  { id: 'rankingGoals', title: 'Goals', display_order: 5, arr_index: 5},
  { id: 'rankingDef', title: 'Defense', display_order: 6, arr_index: 6},
  { id: 'rankingRecord', title: 'Record (W-L-T)', display_order: 7, arr_index: 7},
  { id: 'rankingPlayed', title: 'Played', display_order: 8, arr_index: 8}
];

var tba_api_scoring_config = [
{ 
  id: 'xCrossingPoints', 
  title: 'Crossing Points', 
  dtype: 'int',
  agg: ['autoCrossingPoints','teleopCrossingPoints']
}, { 
  id: 'xBoulderPoints', 
  title: 'Boulder Points', 
  dtype: 'int', 
  agg: ['autoBoulderPoints', 'teleopBoulderPoints']
}, { 
  id: 'xTotalHighGoals', 
  title: 'High Goals', 
  dtype: 'int', 
  agg: ['autoBouldersHigh','teleopBouldersHigh'] 
}, { 
  id: 'xTotalLowGoals', 
  title: 'Low Goals', 
  dtype: 'int', 
  agg: ['autoBouldersLow','teleopBouldersLow']
}, {
  id: 'position2',
  title: 'Position Two',
  dtype: 'string',
  sub: 'position2crossings'
}, {
  id: 'position3',
  title: 'Position Four',
  dtype: 'string',
  sub: 'position3crossings'
}, {
  id: 'position4',
  title: 'Position Four',
  dtype: 'string',
  sub: 'position4crossings'
}];