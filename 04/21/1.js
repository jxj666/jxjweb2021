/*
 * @LastEditTime: 2021-04-20 15:02:00
 * @LastEditors: jinxiaojian
 */
function TestFunctionState () {
  const [count, setCount] = React.useState(0);
  const btnRef = React.useRef(null);
  const eventRef = React.useRef(null);
  eventRef.current = { onClick };
  React.useEffect(() => {
    function onProxyClick (e) {
      eventRef.current.onClick(e);
    }
    // 无法得到准确值
    btnRef.current.addEventListener("click", onClick);
    // 通过转发获取准确值
    btnRef.current.addEventListener("click", onProxyClick);
  }, []);
  function onClick () {
    console.log(count);
  }
  function handleClick () {
    setCount(count + 1)
  }
  React.useEffect(() => {
    setCount(777);
  }, []);
  return (
    <div>
      <p>获取 useState conunt 值</p>
      <p>
        <button ref={btnRef}>打印count</button>
        Count: {count} <button onClick={handleClick}>加一</button>
      </p>
    </div>
  );
}

class App extends React.Component {

  render () {
    return (
      <div className="App">
        <h1>addEventListener</h1>
        <h2>Start editing to see some magic happen!</h2>
        <TestFunctionState />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
