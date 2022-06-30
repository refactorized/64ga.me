import ScoreGrid, {propsScoreGrid} from '@components/ScoreGrid'
import {getType} from 'tst-reflect'

console.log(JSON.stringify(getType<propsScoreGrid>().getProperties()))
