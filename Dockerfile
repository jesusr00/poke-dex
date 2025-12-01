# Dockerfile para EAS Build local de Expo + React Native
# Incluye: Node.js, Android SDK, NDK, Java, y todas las dependencias

FROM ubuntu:22.04

# Evitar prompts interactivos durante la instalación
ENV DEBIAN_FRONTEND=noninteractive

# Configurar variables de entorno para Android
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV NDK_VERSION=27.1.12297006
ENV ANDROID_NDK_HOME=${ANDROID_HOME}/ndk/${NDK_VERSION}
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/build-tools/36.0.0

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    wget \
    openjdk-17-jdk \
    build-essential \
    python3 \
    python3-pip \
    file \
    && rm -rf /var/lib/apt/lists/*

# Instalar Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Instalar pnpm
RUN npm install -g pnpm

# Crear directorio para Android SDK
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools

# Descargar e instalar Android Command Line Tools
RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O /tmp/cmdline-tools.zip \
    && unzip -q /tmp/cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools \
    && mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest \
    && rm /tmp/cmdline-tools.zip

# Aceptar licencias de Android SDK
RUN yes | ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --licenses || true

# Instalar componentes de Android SDK necesarios
RUN ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager \
    "platform-tools" \
    "platforms;android-36" \
    "build-tools;36.0.0" \
    "ndk;${NDK_VERSION}" \
    "cmake;3.22.1" \
    "emulator"

# Instalar EAS CLI globalmente
RUN npm install -g eas-cli

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias del proyecto
RUN pnpm install --frozen-lockfile

# Copiar el resto del proyecto
COPY . .

# Exponer puerto para Metro Bundler (si necesitas desarrollo)
EXPOSE 8081

# Comando por defecto: ejecutar el build automáticamente
CMD ["eas", "build", "--platform", "android", "--profile", "production", "--local", "--non-interactive"]
