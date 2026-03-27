import json
import os
import urllib.request


def handler(event: dict, context) -> dict:
    """
    Генерация персонажа D&D 2024 по описанию игрока через YandexGPT.
    Принимает имя и описание персонажа, возвращает класс, характеристики и стартовые предметы.
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
    name = body.get('name', 'Герой').strip()
    description = body.get('description', '').strip()

    if not description:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Описание персонажа обязательно'}, ensure_ascii=False),
        }

    system_prompt = (
        "Ты — опытный мастер D&D 2024 (актуальные правила Player's Handbook 2024). "
        "По описанию игрока создай карточку персонажа строго в формате JSON. "
        "Верни ТОЛЬКО валидный JSON без лишнего текста, без markdown-блоков. "
        "Формат ответа:\n"
        "{\n"
        '  "class_name": "название класса на русском",\n'
        '  "subclass": "название подкласса на русском",\n'
        '  "race": "раса на русском",\n'
        '  "background": "предыстория на русском",\n'
        '  "level": 1,\n'
        '  "hp": число,\n'
        '  "max_hp": число,\n'
        '  "armor_class": число,\n'
        '  "stats": {"STR": число, "DEX": число, "CON": число, "INT": число, "WIS": число, "CHA": число},\n'
        '  "saving_throws": ["список спасбросков"],\n'
        '  "skills": ["список владений навыками"],\n'
        '  "traits": ["2-3 черты характера/особенности класса"],\n'
        '  "equipment": ["список стартового снаряжения, 5-8 предметов"],\n'
        '  "spells": ["стартовые заклинания если есть, иначе пустой массив"],\n'
        '  "avatar": "один эмодзи символизирующий персонажа",\n'
        '  "backstory": "краткая предыстория 2-3 предложения в духе тёмного фэнтези"\n'
        "}"
    )

    user_message = (
        f"Имя персонажа: {name}\n"
        f"Описание от игрока: {description}\n"
        "Создай персонажа строго по правилам D&D 2024. Характеристики распредели согласно классу. "
        "Верни только JSON."
    )

    api_key = os.environ['YANDEX_API_KEY']
    folder_id = os.environ['YANDEX_FOLDER_ID']

    request_body = {
        "modelUri": f"gpt://{folder_id}/yandexgpt/latest",
        "completionOptions": {
            "stream": False,
            "temperature": 0.5,
            "maxTokens": 1200,
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

    character = json.loads(raw_text)
    character['name'] = name

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'character': character}, ensure_ascii=False),
    }
