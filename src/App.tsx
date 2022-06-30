
import { Fragment, useState } from 'react'
import ScoreGrid from './components/ScoreGrid'
import { TestBench } from '@components/TestBench'

function App() {
  const [count, setCount] = useState(0)

  return (
   <Fragment>
    <TestBench component={ScoreGrid} />
   </Fragment>
  )
}

export default App
