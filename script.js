//let tg = window.Telegram.WebApp;
//let user_name = tg.initDataUnsafe.user.first_name;
let user_name = 'Turonbek';
let user_inf = 0;
let used = false;

// Функция для загрузки данных из user.json
async function fetchUsers() {
    const response = await fetch('users.json');
    const users = await response.json();
    return users;
}

// Функция для сохранения новых данных в user.json
// JavaScript (клиентская часть)
async function saveUser(newUser) {
  try {
    const response = await fetch('save_user.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) {
      throw new Error('Ошибка при сохранении пользователя: ' + response.status);
    }

    const data = await response.json();
    console.log(data.message); // Выводим сообщение от сервера
  } catch (error) {
    console.error('Ошибка при сохранении пользователя:', error);
  }
}


// Основная функция
async function checkUser() {
    const users = await fetchUsers();

    // Проверяем, есть ли пользователь с таким именем
    const userExists = users.some(user => user.name === user_name);

    if (!userExists) {
        // Если пользователя нет, создаем нового
        const newUser = {
            name: user_name,
            id: 0, 
            animals: {
                cat: 0,
                dog: 0,
                tigr: 0
            },
            hearts: 20,
            balance: 0
        };

        // Сохраняем нового пользователя
        await saveUser(newUser);
        window.location.reload();
    } else {
        document.getElementById('user_name').innerText = user_name;
        // Читаем содержимое файла users.json
        fetch('users.json')
        .then(response => response.json())
        .then(users => {
          // Ищем пользователя с именем 'Admin'
          let foundUser = users.find(user => user.name === user_name);

          // Если пользователь найден, выводим его данные
          if (foundUser) {
            user_inf = foundUser;
            if (used) {}
            else {
              userInformation();
              used = true;
            }
          } else {
            console.log("Пользователь не найден.");
          }
        })
        .catch(error => console.error('Ошибка при чтении файла:', error));
    }
}

// Запускаем проверку
checkUser();

function userInformation() {
  checkUser();
  document.getElementById('target').style.width = user_inf.hearts + 'px';
  document.getElementById('target').innerText = user_inf.hearts + '❤️';
  document.getElementById('balance').innerText = user_inf.balance + '💵';

  var animals = document.getElementById('animals');
  if (animals) {
    document.getElementById('catN').innerText = user_inf.animals.cat;
    document.getElementById('dogN').innerText = user_inf.animals.dog;
    document.getElementById('tigerN').innerText = user_inf.animals.tigr;
  } else {
    console.log('no id animals');
  }
}

var menu = document.getElementById('Smenu');
var buy = document.getElementById('buy');
var more = document.getElementById('more');

menu.addEventListener('click', function() {
  document.getElementById('animals').style.display = 'block';
  document.getElementById('Magzine').style.display = 'none';
  menu.style.background = '#ace07c';
  buy.style.background = '';
  more.style.background = '';
})
buy.addEventListener('click', function() {
  document.getElementById('animals').style.display = 'none';
  document.getElementById('Magzine').style.display = 'grid';
  menu.style.background = '';
  buy.style.background = '#ace07c';
  more.style.background = '';
})
more.addEventListener('click', function() {
  //more();
  menu.style.background = '';
  buy.style.background = '';
  more.style.background = '#ace07c';
})


const products = document.querySelectorAll('#Magzine #product');

products.forEach(product => {
  const buyButton = product.querySelector('button');
  buyButton.addEventListener('click', () => {
    const cost = parseFloat(product.querySelector('h1').textContent.replace(/[^0-9\.]/g, '')); // Удаляем все символы, кроме цифр и точки
    let balance = parseFloat(document.getElementById('balance').textContent); // Преобразуем текст в число
    if (balance < cost) {
      alert('У вас денег не хватает!');
    } else {
      const productName = product.querySelector('h3').textContent.toLowerCase(); // Получаем название продукта
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "update_balance.php", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onload = function() {
      if (this.status == 200) {
        document.getElementById('balance').innerText = this.responseText; 
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "update_animals.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function() {
        if (this.status == 200) {
          console.log('Done!');
        } else {
          alert("Ошибка");
        }
        }
        xhr.send("&productName=" + productName + "&userName=" + user_name);
      } else {
        alert("Ошибка при обновлении баланса!");
      }
      }
      xhr.send("cost=" + cost + "&productName=" + productName + "&userName=" + user_name); // Отправляем данные в PHP
    }
  });
});
