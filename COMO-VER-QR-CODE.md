# Como ver o QR Code do Expo

O QR code **só aparece quando você roda o projeto no seu terminal** (não em segundo plano).

## Passos

1. **Pare o servidor** se estiver rodando (Ctrl+C no terminal onde está o Expo).

2. **Abra o Terminal no Cursor:**  
   `Ctrl + `` (acento grave) ou menu **View → Terminal**.

3. **Vá até a pasta do projeto e inicie o Expo:**
   ```bash
   cd c:\Projetos\Pessoal\Alfa
   npm start
   ```
   Ou, se a porta 8081 estiver em uso:
   ```bash
   npx expo start --port 8082
   ```

4. O **QR code** e o menu com atalhos aparecerão **nesse mesmo terminal**.

5. **Se o QR ainda não aparecer:**
   - Pressione **E** no terminal onde o Expo está rodando (mostra o QR code).
   - Ou use o **modo tunnel** (funciona mesmo em redes diferentes):
     ```bash
     npm run start:tunnel
     ```
   - Ou use a **URL manual:** no celular, abra o app **Expo Go** e digite a URL que aparece no terminal (algo como `exp://192.168.x.x:8081`).

## Dica

Use fonte **monoespacada** no terminal (Consolas, Cascadia Code, etc.) e tamanho normal; fontes muito estranhas ou pequenas podem deixar o QR code ilegível para a câmera.
