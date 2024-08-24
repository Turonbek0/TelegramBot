<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate'); // Запрет кэширования
header('Pragma: no-cache'); // Для старых браузеров
header('Expires: 0'); // Устанавливаем время истечения в прошлом

// код для обработки данных:

header('Content-Type: application/json');

// Получаем данные из POST-запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем, корректно ли получены данные
if ($data !== null && isset($data['name'])) {
    // Читаем существующих пользователей из users.json
    $usersFile = 'users.json';
    if (file_exists($usersFile)) {
        $users = json_decode(file_get_contents($usersFile), true);
    } else {
        $users = []; // Если файл не существует, создаем пустой массив
    }

    // Проверяем, существует ли пользователь с таким именем
    $userExists = false;
    foreach ($users as $user) {
        if ($user['name'] === $data['name']) {
            $userExists = true;
            break;
        }
    }

    if (!$userExists) {
        // Добавляем нового пользователя
        $users[] = $data;

        // Сохраняем обновленный массив пользователей обратно в users.json
        file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));

        echo json_encode(['message' => 'Пользователь успешно добавлен']);
    } else {
        echo json_encode(['message' => 'Ошибка: пользователь уже существует']);
    }
} else {
    echo json_encode(['message' => 'Ошибка: данные не получены']);
}
?>