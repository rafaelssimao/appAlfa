# Configurar Android SDK no Windows

Os erros `Failed to resolve the Android SDK path` e `'adb' não é reconhecido` significam que o **Android SDK** não está instalado ou o sistema não sabe onde ele está.



## Opção 1: Instalar pelo Android Studio (recomendado)

1. **Baixe e instale o Android Studio**  
   https://developer.android.com/studio

2. **Abra o Android Studio** e vá em:  
   **More Actions** → **SDK Manager** (ou **File** → **Settings** → **Appearance & Behavior** → **System Settings** → **Android SDK**).

3. **Anote o caminho do SDK** (ex.: `C:\Users\rafael.simao\AppData\Local\Android\Sdk`).

4. **Configure as variáveis de ambiente** no Windows:
   - Pesquise **“Variáveis de ambiente”** no menu Iniciar e abra **“Editar as variáveis de ambiente do sistema”**.
   - Em **Variáveis do sistema**, clique em **Novo**:
     - **Nome:** `ANDROID_HOME`
     - **Valor:** o caminho do SDK (ex.: `C:\Users\rafael.simao\AppData\Local\Android\Sdk`)
   - Edite a variável **Path** e adicione:
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\emulator`
   - Confirme com **OK** em todas as janelas.

5. **Feche e abra de novo** o terminal (ou o Cursor) para carregar as variáveis.

6. **Confira** no PowerShell:
   ```powershell
   echo $env:ANDROID_HOME
   adb version
   ```

## Opção 2: SDK só por linha de comando

1. Baixe as **command line tools** do Android:  
   https://developer.android.com/studio#command-tools

2. Extraia para uma pasta (ex.: `C:\Android\cmdline-tools`).

3. Defina `ANDROID_HOME` apontando para a pasta do SDK (onde estão `platform-tools`, etc.) e inclua `%ANDROID_HOME%\platform-tools` no **Path**, como na opção 1.

## Depois de configurar

No projeto Alfa, rode de novo:

```bash
npx expo run:android
```

Se o SDK estiver em outro caminho, use-o no lugar de `C:\Users\rafael.simao\AppData\Local\Android\Sdk` ao definir `ANDROID_HOME`.
