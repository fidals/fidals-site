# ЖБИ изделия
**Проект** - [stroyprombeton.ru](http://www.stroyprombeton.ru)
<br><br>

- [Сроки](#period)
- [Порядок работы](#work-order)
- [Командам, прогерам](#4teams)
  - [Технологии](#technologies)
  - [Фичи](#features)
    - [Автотесты](#autotests)
    - [Автокомплит](#autocomplete)
    - [Админка](#admin-panel)

<br>
<h2 id="period">Сроки</h2>

Базовый функционал магазина перенесли с modx на Symfony за 2 нед.

<br>
<h2 id="work-order">Порядок работы</h2>

- Аналитика + Юзабилити
- Дизайн-макет
- Вёрстка
- Разработка
- Наполнение
- Маркетинг

<br>
<h2 id="4teams">Командам, прогерам</h2>

<br>
<h3 id="technologies">Технологии</h3>

- Symfony 2.8
- Mysql via Doctrine ORM
- Less + AsseticBundle
- Behat + Selenium
- js + jQuery


[Почему Symfony](http://dev.fidals.com/blog/se-project.html#why-symfony)

<br>
<h3 id="features">Фичи</h3>
<br>
<h4 id="autotests">Автотесты</h4>
Работаем через TDD. Тестируем данные на фронте.
Автотесты реализовали с помощью Behat+Mink+Selenium

<br>
<br>
<h4 id="autocomplete">Автокомплит</h4>
Сортируем результаты выдачи по точности вхождения запроса.
Реализовали на [DQL](http://symfony.com/doc/current/book/doctrine.html#querying-for-objects-with-dql).

<br>
<br>
<h4 id="admin-panel">Админка</h4>

Задачи админки:
- Полностью помещается на full-hd экране до сгиба
- WYSIAWYG редактор
- Валидация полей
- Поиск страниц из админки

Используем Symfony Forms.
От SonataAdmin отказались. В ней тяжело кастомизировать работу со связями и с файлами.