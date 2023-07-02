import './App.css';
import { useState } from 'react'; // state를 사용하기 위해 훅을 사용해야 한다. react에서 제공하는
// 기본적인 함수이다.
// props가 뭐다? 부모 컴포넌트가 자식 컴포넌트에 값을 전달할때
// 사용하는 것이다. 자식 컴포넌트가 props을 부모에게 받아서 사용할 수있음

function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body} 
  </article>
}
//부모요소의 body를 가져오는 것


function Header(props) {
  return <header>
    <h1><a href="/" onClick={(event)=>{
      // 클릭했을 때 함수가 호출되는 것이다.
      event.preventDefault();  // a태그 실행됐을때 기본동작을 방지 reload 방지
      props.onChangeMode(); //부모에 있는 함수 호출
    }}>{props.title}</a></h1>
  </header>
}
// 클릭했을때 해야 할 행동을 정의하는 것이다. 

// list 요소를 부모함수에서 처리하기 위한 nav코드가 필요하다.

function Nav(props){
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event=>{
        event.preventDefault(); 
        // onChangemode를 실행한다. 
        props.onChangeMode(Number(event.target.id));
        // id 속성을 부여하고 event.target을 통해 이벤트를 유발시키는 객체 지정  
      }}>{t.title}</a>
      
      </li>)
  }
  //key 값을 가지고, unique하며 태그를 통해 누르면 온클릭 이벤트를 발생시킬 수 있다. 
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}
// form태그를 공부하기
function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault(); //페이지의 reload방지하기 위해
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type='text' name='title'placeholder='title'/></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type='submit' value="Create"></input></p>
    </form>
  </article>
  //create 버튼을 누른 후 처리 -> 후속작업을 실행하는 함수를 전달하면 된다. 
}
// palceholder 어떤 정보를 입력하면 좋을지 나타내는것

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setbody] = useState(props.body);
  return <article>
  <h2>Update</h2>
  <form onSubmit={event=>{
    event.preventDefault(); //페이지의 reload방지하기 위해
    const title = event.target.title.value;
    const body = event.target.body.value;
    props.onUpdate(title, body);
  }}>
    <p><input type='text' name='title'placeholder='title' value={title} onChange={event=>{
      console.log(event.target.value);
      setTitle(event.target.value);
    }}/></p>
    <p><textarea name='body' placeholder='body' value={body} onChange={event=>{
      console.log(event.target.value);
      setbody(event.target.value);
    }}></textarea></p>
    <p><input type='submit' value="Update"></input></p>
  </form>
</article>

// prop을 state로 변경하는 것이다. state는 내부자가 사용하는 데이터이다. 

}

function App() {
  // const _mode = useState('WELCOME'); //배열을 리턴을 하고 0:번째 상태의 값을 읽을때
  // //1: 상태의 값을 변경할때 
  // const mode = _mode[0]; //초깃값
  // const setMode = _mode[1]; //state를 변경할때 이 값으로 한다.
  const [mode, setMode] = useState('WELCOME'); // 위의 3줄 코드를 한줄로 요약가능
  const [id, setId] = useState(null);
  // 읽기와 쓰기를
  const [nextId, setNextId] = useState(4); // 다음에 생성되는 id
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]);
  let content = null;
  let contextControl = null; //맥락적으로 노출되는 ui 
  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <li><a href={"/update/"+id} onClick={event=>{
      event.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>

  } else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);//새로 렌더링 된다.
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1); // 글의 상세보기 페이지로 넘어간다. 
    }}></Create>

    // title, body 컴보넌트를 가지고 있어야 한다. 
  } else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      console.log(title, body); //잘 출력된다.  변경된 값으로 topics를 변경하기
      const newTopics = [...topics]
      const updatedTopic = {id:id ,title:title, body:body} //수정할 topic을 만들었다. 
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics); //새로운 topic을 저장을 한다. 
      setMode('READ');
    }}></Update>
    
  }


  // APP 함수를 실행시켜서 return값을 만들어야 한다. 
  return (
    <div>
      <Header title="WEB" onChangeMode={()=> {
        //mode = 'WELCOME';
        setMode('WELCOME');
      }}></Header>   
      <Nav topics={topics} onChangeMode={(id)=>{
        //mode = 'READ';
        setMode('READ');
        setId(id);
      }}></Nav>
      {content}
      <ul>
        <li><a href="/create" onClick={event=>{
          event.preventDefault(); //url이 변경되지 않게 하는것이다.
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}
export default App;
