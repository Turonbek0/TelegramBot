<?php
$cost = $_POST['cost'];
$productName = $_POST['productName']; 
$userName = $_POST['userName'];

// Загружаем данные из users.json
$data = json_decode(file_get_contents('users.json'), true);

// Находим пользователя по имени
$user = null;
foreach ($data as &$item) {
  if ($item['name'] == $userName) {
    $user = &$item;
    break; 
  }
}

// Если пользователь найден, обновляем баланс
if ($user) {
  $user['balance'] -= $cost; 
  file_put_contents('users.json', json_encode($data));
  echo $user['balance'];
} else {
  echo "Пользователь не найден!"; //  Добавляем обработку ошибки
}
?>
