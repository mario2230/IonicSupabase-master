<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main class="profile-page">
        <header class="page-heading">
          <div>
            <p class="eyebrow">SUA CONTA</p>
            <h1>Meu perfil</h1>
          </div>
          <ion-button class="logout-button" fill="outline" color="danger" disabled>
            <ion-icon slot="start" :icon="logOutOutline"></ion-icon>
            Sair
          </ion-button>
        </header>

        <ion-card v-if="carregando" class="profile-card state-card">
          <ion-spinner name="crescent"></ion-spinner>
          <ion-text>Carregando seu perfil...</ion-text>
        </ion-card>
        <ion-card v-else-if="erro" class="profile-card state-card error-card">
          <ion-text>{{ erro }}</ion-text>
        </ion-card>
        <ion-card v-else-if="perfil" class="profile-card">
          <div class="profile-hero">
            <img v-if="fotoUrl" class="avatar" :src="fotoUrl" alt="Foto de perfil" />
            <div v-else class="avatar avatar-placeholder">
              {{ perfil.nome?.charAt(0)?.toUpperCase() || "?" }}
            </div>
            <h2>{{ perfil.nome || "Seu nome" }}</h2>
            <p>@{{ perfil.nickname || "sem apelido" }}</p>
          </div>

          <div class="profile-details">
            <div class="detail-row">
              <span class="detail-label">Nome</span>
              <span class="detail-value">{{ perfil.nome || "Não informado" }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Apelido</span>
              <span class="detail-value">{{ perfil.nickname || "Não informado" }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Data de nascimento</span>
              <span class="detail-value">{{ perfil.data_nascimento || "Não informada" }}</span>
            </div>
          </div>
        </ion-card>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCard, IonText, IonButton, IonIcon, IonSpinner } from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import { usePerfil } from '@/service/userPerfil';
import { ref } from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';
const { buscarPerfil } = usePerfil();
const { carregarImagem } = usePerfil();

const perfil = ref<{
  nome: string | null;
  nickname: string | null;
  data_nascimento: string | null;
  foto_url: string | null;
} | null>(null);

const fotoUrl = ref<string | null>("");


const carregando = ref(true);
const erro = ref("")

onIonViewWillEnter(async () => {
  try {
    perfil.value = await buscarPerfil();
    fotoUrl.value = perfil.value?.foto_url ? await carregarImagem(perfil.value.foto_url): null;
  } catch (err) {
    erro.value = err instanceof Error ? err.message : "Não foi possível carregar o perfil.";
  } finally {
    carregando.value = false;
  }
});
</script>
