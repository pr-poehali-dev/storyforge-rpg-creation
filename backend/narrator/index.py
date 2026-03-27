import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """
    ИИ-рассказчик на YandexGPT.
    Принимает историю игры и выбор игроков, возвращает следующий фрагмент истории и новые варианты выборов.
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
    story_title = body.get('story_title', 'Безымянная история')
    story_history = body.get('story_history', '')
    chosen_action = body.get('chosen_action', '')
    custom_action = body.get('custom_action', '')
    players = body.get('players', [])

    action_text = custom_action if custom_action else chosen_action

    players_str = ', '.join([f"{p['name']} ({p['playerClass']})" for p in players]) if players else 'герои'

    system_prompt = (
        "Ты — таинственный рассказчик тёмного фэнтези. Ты ведёшь коллективную ролевую игру. "
        "Твой стиль: атмосферный, образный, немного мрачный, с деталями окружения. "
        "Пиши от второго лица (вы). Длина фрагмента: 3-5 предложений. "
        "После текста истории ОБЯЗАТЕЛЬНО добавь блок с 4 вариантами выбора в точном формате:\n"
        "ВЫБОРЫ:\n"
        "A: [текст варианта]\n"
        "B: [текст варианта]\n"
        "C: [текст варианта]\n"
        "D: [текст варианта]"
    )

    user_message = (
        f"История: {story_title}\n"
        f"Участники: {players_str}\n"
    )
    if story_history:
        user_message += f"Предыдущие события: {story_history}\n"
    if action_text:
        user_message += f"Игроки выбрали: {action_text}\n"
    user_message += "Продолжи историю и предложи 4 варианта следующего действия."

    api_key = os.environ['YANDEX_API_KEY']
    folder_id = os.environ['YANDEX_FOLDER_ID']

    request_body = {
        "modelUri": f"gpt://{folder_id}/yandexgpt-lite/latest",
        "completionOptions": {
            "stream": False,
            "temperature": 0.8,
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

    with urllib.request.urlopen(req, timeout=25) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    full_text = result['result']['alternatives'][0]['message']['text']

    story_part = full_text
    choices = []

    if 'ВЫБОРЫ:' in full_text:
        parts = full_text.split('ВЫБОРЫ:')
        story_part = parts[0].strip()
        choices_raw = parts[1].strip().split('\n')
        letters = ['A', 'B', 'C', 'D']
        for i, line in enumerate(choices_raw):
            line = line.strip()
            if not line:
                continue
            for letter in letters:
                if line.startswith(f'{letter}:'):
                    choices.append({
                        'letter': letter,
                        'text': line[2:].strip(),
                        'votes': 0,
                        'highlighted': False,
                    })
                    break

    if not choices:
        choices = [
            {'letter': 'A', 'text': 'Двигаться вперёд осторожно', 'votes': 0, 'highlighted': False},
            {'letter': 'B', 'text': 'Исследовать окружение', 'votes': 0, 'highlighted': False},
            {'letter': 'C', 'text': 'Подождать и понаблюдать', 'votes': 0, 'highlighted': False},
            {'letter': 'D', 'text': 'Отступить и перегруппироваться', 'votes': 0, 'highlighted': False},
        ]

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({
            'story': story_part,
            'choices': choices,
        }, ensure_ascii=False),
    }
