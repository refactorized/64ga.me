import {getType, Type} from 'tst-reflect'
import {JSONTree} from 'react-json-tree'

type Etc<T> = T & { [index:string]: any }

interface simpleComponent<T> {
  (props: Etc<T>): JSX.Element
}

interface TestBenchOptions<T> {
  init?: T
}

interface propsTestBench<T> { component: simpleComponent<T>, options?: TestBenchOptions<T>} 

const TestBench = function<T>(props: propsTestBench<T>){
  const C = props.component;
  const t = getType<T>()
  const p = props.options?.init || {};
  console.log(t.getProperties())
  return <div>
    <C {...p} />
    <JSONTree data={t}/>
  </div>
}

export default TestBench;

const comp = () => <div />

const fn = TestBench({component: comp})
