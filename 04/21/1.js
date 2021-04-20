/*
 * @LastEditTime: 2021-04-20 14:26:21
 * @LastEditors: jinxiaojian
 */
function TestFunctionState() {
  const [count, setCount] = React.useState(0);
  const btnRef = React.useRef(null);
  const eventRef=React.useRef(null);
  eventRef.current={onClick};
  React.useEffect(() => {
    function onProxyClick(e){
      eventRef.current.onClick(e);
      console.log('proxy');
    }
    btnRef.current.addEventListener("click", onClick);
    btnRef.current.addEventListener("click", onProxyClick);
  }, []);
  function onClick() {
    console.log(count);
  }
  function handleClick(){
    setCount(count+1)
  }
  React.useEffect(() => {
    setCount(777);
  }, []);
  return (
    <div>
      <p>useState api</p>
      <p>
        <button ref={btnRef}>打印count</button>
        Count: {count} <button onClick={handleClick}>自增</button>
      </p>
    </div>
  );
}

class App extends React.Component {
  
  render() {
    return (
      <div className="App">
        <h1>Hello</h1>
        <h2>Start editing to see some magic happen!</h2>
        <TestFunctionState />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
