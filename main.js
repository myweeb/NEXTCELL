// ======================
// Inicialização Firebase
// ======================
let db, storage;



function inicializarFirebase(){
  const firebaseConfig = {
    apiKey: "AIzaSyDotPeLOCBut-b6d06uZIACYsOssBi8JDE",
    authDomain: "fernado-store.firebaseapp.com",
    projectId: "fernado-store",
    storageBucket: "fernado-store.firebasestorage.app",
    messagingSenderId: "815398585485",
    appId: "1:815398585485:web:7c0a01f1447d4e1c70cec4",
  };
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  storage = firebase.storage();
}

// ======================
// Funções para clientes
// ======================
function carregarProdutos(){
  const container = document.getElementById('produtos');
  if(!container) return;
  container.innerHTML = '';
  db.collection('produtos').get().then(snapshot=>{
    snapshot.forEach(doc=>{
      const p = doc.data();
      const card = document.createElement('div');
      card.className='card';
      card.dataset.cat = p.cat;
      card.innerHTML = `
        <img src="${p.imagem}" alt="${p.nome}">
        <div class="card-body">
          <h3>${p.nome}</h3>
          <div class="preco">${p.preco}</div>
          <a href="https://wa.me/${p.whatsapp}?text=Olá,%20quero%20comprar%20${encodeURIComponent(p.nome)}%20-%20${encodeURIComponent(p.preco)}%0A${encodeURIComponent(p.imagem)}" target="_blank" class="btn">COMPRAR</a>
        </div>`;
      container.appendChild(card);
    });
  });
}

// Filtrar produtos
function filtrar(cat){
  const cards = document.querySelectorAll('.card');
  cards.forEach(c=>{
    if(cat==='todos'||c.dataset.cat===cat){c.style.display='flex';}
    else{c.style.display='none';}
  });
}

// ======================
// Login Vendedor
// ======================
const USUARIO='admin';
const SENHA='1234';

function loginVendedor(){
  const user=document.getElementById('user').value;
  const pass=document.getElementById('pass').value;
  if(user===USUARIO && pass===SENHA){
    localStorage.setItem('logado','true');
    window.location.href='admin.html';
  }else{
    document.getElementById('msgLogin').innerText='Usuário ou senha incorretos!';
  }
}

function verificarLogin(){
  if(localStorage.getItem('logado')!=='true'){
    alert('Você precisa fazer login!');
    window.location.href='login.html';
  }
}

function logout(){
  localStorage.removeItem('logado');
  window.location.href='login.html';
}

// ======================
// Admin - carregar produtos
// ======================
function carregarProdutosAdmin(){
  const container = document.getElementById('produtos-admin');
  if(!container) return;
  container.innerHTML = '';
  db.collection('produtos').get().then(snapshot=>{
    snapshot.forEach(doc=>{
      const p = doc.data();
      const id = doc.id;
      const card = document.createElement('div');
      card.className='card';
      card.innerHTML = `
        <img src="${p.imagem}" alt="${p.nome}">
        <div class="card-body">
          <h3>${p.nome}</h3>
          <div class="preco">${p.preco}</div>
          <button class="btn" onclick="removerProduto('${id}')">Remover</button>
        </div>`;
      container.appendChild(card);
    });
  });
}

// ======================
// Upload de imagem para Storage
// ======================
function uploadImagem(fileInput, callback){
  const file = fileInput.files[0];
  if(!file) return alert("Selecione um arquivo!");
  
  const storageRef = storage.ref('produtos/' + file.name);
  const uploadTask = storageRef.put(file);

  uploadTask.on('state_changed',
    snapshot => {
      // opcional: progresso do upload
    },
    error => {
      alert("Erro ao enviar imagem: " + error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then(url => {
        callback(url);
      });
    }
  );
}

// ======================
// Adicionar Produto (Admin)
// ======================
function adicionarProduto(){
  const nome = document.getElementById('nome').value.trim();
  const preco = document.getElementById('preco').value.trim();
  const cat = document.getElementById('categoria').value;
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const fileInput = document.getElementById('imagemFile');

  if(nome && preco && whatsapp && fileInput.files.length > 0){
    uploadImagem(fileInput, (url) => {
      db.collection('produtos').add({
        nome,
        preco,
        cat,
        whatsapp,
        imagem: url
      }).then(()=>{
        alert('Produto adicionado com imagem online!');
        document.getElementById('nome').value='';
        document.getElementById('preco').value='';
        document.getElementById('whatsapp').value='';
        document.getElementById('imagemFile').value='';
        carregarProdutos();
        carregarProdutosAdmin();
      });
    });
  }else{
    alert('Preencha todos os campos e selecione uma imagem!');
  }
}

// ======================
// Remover Produto (Admin)
// ======================
function removerProduto(id){
  if(confirm('Deseja realmente remover este produto?')){
    db.collection('produtos').doc(id).delete().then(()=>{
      carregarProdutos();
      carregarProdutosAdmin();
    });
  }
}
