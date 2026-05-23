-- Reference data (idempotent)

INSERT OR IGNORE INTO ItemStatuses (name) VALUES ('в использовании');
INSERT OR IGNORE INTO ItemStatuses (name) VALUES ('на хранении');
INSERT OR IGNORE INTO ItemStatuses (name) VALUES ('на выброс/в переработку');
INSERT OR IGNORE INTO ItemStatuses (name) VALUES ('потеряна/отдана');

INSERT OR IGNORE INTO Categories (name) VALUES ('верхняя одежда');
INSERT OR IGNORE INTO Categories (name) VALUES ('обувь');
INSERT OR IGNORE INTO Categories (name) VALUES ('нижняя одежда');
INSERT OR IGNORE INTO Categories (name) VALUES ('аксессуары');

INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Чёрный', '#000000');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Белый', '#FFFFFF');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Серый', '#808080');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Тёмно-серый', '#A9A9A9');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Светло-серый', '#D3D3D3');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Бежевый', '#F5F5DC');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Кремовый', '#FFFDD0');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Слоновая кость', '#FFFFF0');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Коричневый', '#A52A2A');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Тёмно-коричневый', '#654321');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Синий', '#0000FF');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Тёмно-синий', '#000080');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Голубой', '#ADD8E6');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Небесно-голубой', '#87CEEB');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Бирюзовый', '#40E0D0');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Индиго', '#4B0082');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Васильковый', '#6495ED');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Зелёный', '#008000');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Тёмно-зелёный', '#006400');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Оливковый', '#808000');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Мятный', '#98FF98');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Изумрудный', '#50C878');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Салатовый', '#99FF99');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Красный', '#FF0000');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Бордовый', '#800000');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Винный', '#722F37');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Алый', '#FF2400');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Розовый', '#FFC0CB');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Пудровый', '#FDE9E0');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Коралловый', '#FF7F50');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Фуксия', '#FF00FF');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Жёлтый', '#FFFF00');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Горчичный', '#FFDB58');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Оранжевый', '#FFA500');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Персиковый', '#FFDAB9');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Фиолетовый', '#800080');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Сиреневый', '#C8A2C8');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Лавандовый', '#E6E6FA');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Песочный', '#C2B280');
INSERT OR IGNORE INTO Colors (name, hex_code) VALUES ('Хаки', '#C3B091');

INSERT OR IGNORE INTO Tags (name, color_id)
VALUES ('Домашнее', (SELECT id FROM Colors WHERE name = 'Светло-серый'));
INSERT OR IGNORE INTO Tags (name, color_id)
VALUES ('Выходное', (SELECT id FROM Colors WHERE name = 'Красный'));
INSERT OR IGNORE INTO Tags (name, color_id)
VALUES ('Парадное', (SELECT id FROM Colors WHERE name = 'Жёлтый'));
INSERT OR IGNORE INTO Tags (name, color_id)
VALUES ('Деловое', (SELECT id FROM Colors WHERE name = 'Тёмно-синий'));
INSERT OR IGNORE INTO Tags (name, color_id)
VALUES ('На выброс', (SELECT id FROM Colors WHERE name = 'Коричневый'));

DELETE FROM Colors
WHERE id NOT IN (
  SELECT MIN(id)
  FROM Colors
  GROUP BY name
);

INSERT OR IGNORE INTO schema_migrations (version) VALUES (1);
