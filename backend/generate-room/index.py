import json
import os
import urllib.request


def handler(event: dict, context) -> dict:
    """
    Генерация игровой комнаты D&D по описанию сюжета и сеттинга через YandexGPT.
    Возвращает название, жанр и вступительный текст истории.
    """
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    description = body.get('description', '').strip()
    max_players = body.get('max_players', 6)

    if not description:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Описание сюжета обязательно'}, ensure_ascii=False),
        }

    system_prompt = (
        "Ты — мастер D&D и сценарист тёмного фэнтези. По описанию сюжета и сеттинга создай игровую комнату. "
        "Верни ТОЛЬКО валидный JSON без markdown-блоков и лишнего текста. "
        "Формат:\n"
        "{\n"
        '  "name": "короткое атмосферное название комнаты (3-5 слов)",\n'
        '  "genre": "жанр одним из: Тёмное фэнтези | Эпика | Магия | Мистика | Приключение | Хоррор | Политика | Морское приключение",\n'
        '  "story_intro": "вступительный текст истории — атмосферный, от второго лица (вы), 4-6 предложений, передающий сеттинг, настроение и завязку сюжета"\n'
        "}"
    )

    user_message = (
        f"Описание сюжета и сеттинга от мастера:\n{description}\n\n"
        f"Максимум игроков: {max_players}\n"
        "Создай игровую комнату. Верни только JSON."
    )

    api_key = os.environ['YANDEX_API_KEY']
    folder_id = os.environ['YANDEX_FOLDER_ID']

    request_body = {
        "modelUri": f"gpt://{folder_id}/yandexgpt/latest",
        "completionOptions": {
            "stream": False,
            "temperature": 0.75,
            "maxTokens": 800,
        },
        "messages": [
            {"role": "system", "text": system_prompt},
            {"role": "user", "text": user_message},
        ],
    }

    req = urllib.request.Request(
        "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
        data=json.dumps(request_body).encode('utf-8'),
        headers={
            'Authorization': f'Api-Key {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    with urllib.request.urlopen(req, timeout=28) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    raw_text = result['result']['alternatives'][0]['message']['text'].strip()

    if raw_text.startswith('```'):
        raw_text = raw_text.split('```')[1]
        if raw_text.startswith('json'):
            raw_text = raw_text[4:]
        raw_text = raw_text.strip()

    room_data = json.loads(raw_text)

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'room': room_data}, ensure_ascii=False),
    }
