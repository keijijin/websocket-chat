# React WebSocket チャットアプリケーション

これは、ReactとSocket.IOを使用して構築されたシンプルなチャットアプリケーションです。このアプリケーションを使用すると、ユーザーはWebSocketサーバーに接続し、チャット用のユーザー名を入力し、メッセージを送信し、他のユーザーからのメッセージをリアルタイムで見ることができます。

## 特徴

- WebSocketサーバーへの接続
- チャット用ユーザー名の入力
- メッセージの送信
- 他のユーザーからのメッセージの受信および表示

## 前提条件

- Node.js (バージョン12.x以降)
- npm (バージョン6.x以降)
- WebSocketサーバーが `http://127.0.0.1:8080` で稼働していること

## はじめに

以下の手順に従って、プロジェクトをローカルマシンにセットアップして実行してください。

### インストール

1. リポジトリをクローンします:

    ```bash
    git clone https://github.com/yourusername/react-websocket-chat.git
    cd react-websocket-chat
    ```

2. 依存関係をインストールします:

    ```bash
    npm install
    ```

### アプリケーションの実行

1. WebSocketサーバーを起動します（`http://127.0.0.1:8080`で稼働していることを確認してください）。

2. Reactアプリケーションを起動します:

    ```bash
    npm start
    ```

3. ブラウザを開き、`http://localhost:3000` にアクセスします。

## コードの説明

### `src/App.js`

このファイルには、Reactアプリケーションの主なロジックが含まれています。

#### 依存関係のインポート

```javascript
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
```

- `React`、`useState`、`useEffect` は、状態管理と副作用の処理のためにReactライブラリからインポートされます。
- `socketIOClient` は、WebSocket接続を処理するために `socket.io-client` ライブラリからインポートされます。
- `./App.css` には、アプリケーションのスタイリングが含まれています。

#### 定数

```javascript
const ENDPOINT = "http://127.0.0.1:8080";
```

- `ENDPOINT` は、WebSocketサーバーのURLです。

#### 状態変数

```javascript
const [userName, setUserName] = useState('');
const [message, setMessage] = useState('');
const [messages, setMessages] = useState([]);
const [socket, setSocket] = useState(null);
```

- `userName`: ユーザーが入力したユーザー名を格納します。
- `message`: ユーザーが入力中のメッセージを格納します。
- `messages`: チャットメッセージのリストを格納します。
- `socket`: WebSocket接続のインスタンスを格納します。

#### useEffectフック

```javascript
useEffect(() => {
  if (socket) {
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }
}, [socket]);
```

- このフックは、`socket` 状態が変わるときに実行されます。
- WebSocket接続のイベントリスナーを設定します:
  - `message`: 受信したメッセージを `messages` 状態に追加します。
  - `connect`: WebSocketが接続されたときにログを出力します。
  - `disconnect`: WebSocketが切断されたときにログを出力します。

#### イベントハンドラー

- `handleConnect`

```javascript
const handleConnect = () => {
  const newSocket = socketIOClient(ENDPOINT, { query: { userName } });
  setSocket(newSocket);
};
```

- この関数は、ユーザーが「Connect」ボタンをクリックしたときに呼び出されます。
- 新しいWebSocket接続を作成し、`socket` 状態を更新します。

- `handleSendMessage`

```javascript
const handleSendMessage = () => {
  if (message && socket) {
    const newMessage = { user: userName, message };
    socket.emit('message', newMessage);
    setMessage('');
  }
};
```

- この関数は、ユーザーが「Send」ボタンをクリックしたときに呼び出されます。
- 現在のメッセージをWebSocketサーバーに送信し、メッセージ入力をクリアします。

#### JSXレイアウト

```javascript
return (
  <div className="App">
    {!socket ? (
      <div>
        <h2>Enter your chat user name</h2>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button onClick={handleConnect}>Connect</button>
      </div>
    ) : (
      <div>
        <div>
          <h2>Chat</h2>
          <div className="chat-container">
            {messages.map((msg, index) => (
              <div key={index}><strong>{msg.user}: </strong>{msg.message}</div>
            ))}
          </div>
        </div>
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    )}
  </div>
);
```

- `socket` が接続されていない場合、ユーザーがユーザー名を入力するための入力フィールドと「Connect」ボタンを表示します。
- `socket` が接続されている場合、チャットメッセージと新しいメッセージを入力して送信するための入力フィールドを表示します。

## スタイリング

### `src/App.css`

```css
.App {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 20px;
}

.chat-container {
  border: 1px solid #ccc;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}

input[type="text"] {
  padding: 10px;
  width: 300px;
  margin: 5px;
}

button {
  padding: 10px;
  width: 100px;
  margin: 5px;
}
```

- `.App`: メインコンテナのスタイリング。
- `.chat-container`: チャットメッセージコンテナのスタイリング。
- `input[type="text"]`: 入力フィールドのスタイリング。
- `button`: ボタンのスタイリング。

## 結論

このアプリケーションは、ReactとSocket.IOを使用した基本的なチャットインターフェースを示しています。WebSocket接続を処理し、メッセージを送受信し、UIをリアルタイムで更新します。提供されたコードと手順を使用して、ローカルマシンでアプリケーションをセットアップして実行するのに役立ちます。