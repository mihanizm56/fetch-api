---
title: Описание API
---

import Link from '@docusaurus/Link';

## Параметры запросов:

| Name                        | Type                             | Comments                                                                                                                            |
| --------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| endpoint                    | `string`                         | URL запроса                                                                                                                         |
| responseSchema              | `joi schema`                     | схема ответа joi                                                                                                                    |
| body                        | `<YourType>`                     | тело запроса                                                                                                                        |
| queryParams                 | `Record<string,any>`             | объект query параметров запроса                                                                                                     |
| translateFunction           | `(key,options) => string`        | коллбек, который будет вызван для возможного перевода поля errorText                                                                |
| isErrorTextStraightToOutput | `boolean`                        | флаг, выключающий преобразование текста ошибки - будет проброшен напрямую с бекенда без возможности перевода библиотекой            |
| extraValidationCallback     | `(response:<YourType>)=>boolean` | коллбек, который можно использовать для кастомной валидации ответа                                                                  |
| customTimeout               | `number`                         | количество миллисекунд до таймаута запроса (включая попытки повторного запроса если указан параметр retry и запрос прошёл неудачно) |
| retry                       | `number`                         | количество попыток запрос данные еще раз если ответ не успешен                                                                      |
| pureJsonFileResponse        | `boolean`                        | флаг, убирающий доп заголовки для возможности получения файла (доступно только для PureRestRequest)                                 |

### Также состоит из множества fetch параметров (headers, mode, итд), можно посмотреть <Link to='https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch'>тут</Link>

## Получаемые поля из всех типов запросов:

| Name             | Type         | Comments                              |
| ---------------- | ------------ | ------------------------------------- |
| error            | `boolean`    | флаг состояния ошибки                 |
| errorText        | `string`     | текст ошибки                          |
| data             | `<YourType>` | данные ответа                         |
| additionalErrors | `any`        | любые дополнительные данные с бекенда |
| code             | `number`     | код состояния ошибки                  |
| headers             | `object`     | объект с передаваемыми заголовками от бекенда                  |
