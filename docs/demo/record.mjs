import {record} from './studio.mjs';
import {fileURLToPath} from 'node:url';
const tour={async tour(f){
  const p=f.page,button=name=>p.getByRole('button',{name,exact:true});
  f.mark('Board and task creation');await f.move(500,270,1);await f.click(button('Task'));await f.camera(720,450,1.25);
  await f.type(p.locator('#title'),'Ship the README');await f.type(p.locator('#description'),'Record a guided product walkthrough.');await f.click(p.locator('#status'));await f.click(p.getByRole('option',{name:'In Progress',exact:true}));await f.click(button('Create Task'));await f.camera();
  await f.assert(()=>p.locator('body').innerText().then(t=>t.includes('Ship the README')),'New task appears in the board');
  f.mark('List view and editing a task');await f.click(p.getByRole('radio',{name:'List view'}));await f.camera(650,320,1.25);await f.beat(.55);
  const title=p.getByText('Ship the README',{exact:true});await f.click(title);await f.camera(720,450,1.3);await f.click(p.locator('#status'));await f.click(p.getByRole('option',{name:'Done',exact:true}));await f.click(button('Save Changes'));await f.camera();
  await f.click(p.getByRole('radio',{name:'Board view'}));f.mark('Completed task on the board');await f.move(680,350,1);await f.scrollElement(p.locator('div.overflow-x-auto').filter({has:p.getByText('Ship the README',{exact:true})}).last(),500,0,1.1);await f.camera(640,350,1.2);await f.beat(.65);
 }}.tour;
await record({name:"capy-ui-clone",url:"https://capy-ui-clone.vercel.app",tour,output:fileURLToPath(new URL('../images/',import.meta.url))});
