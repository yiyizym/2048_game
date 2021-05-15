<script lang="ts">
  import { onMount } from 'svelte';
  import GameManager from './javascripts/GameManager';
  import KeyboardInputManager from './javascripts/KeyboardInputManager';
  import HTMLActuator from './javascripts/HTMLActuator';

  onMount(() => {
    new GameManager(4, KeyboardInputManager, HTMLActuator);
  })
</script>

<main class="container">
  <div class="heading">
    <h1 class="title">2048</h1>
    <div class="score-container">0</div>
  </div>
  <p class="game-intro">
    Join the numbers and get to the <strong>2048 tile!</strong>
  </p>

  <div class="game-container">
    <div class="game-message">
      <p />
      <div class="lower">
        <a class="retry-button">Try again</a>
      </div>
    </div>

    <div class="grid-container">
      <div class="grid-row">
        <div class="grid-cell" />
        <div class="grid-cell" />
        <div class="grid-cell" />
        <div class="grid-cell" />
      </div>
      <div class="grid-row">
        <div class="grid-cell" />
        <div class="grid-cell" />
        <div class="grid-cell" />
        <div class="grid-cell" />
      </div>
      <div class="grid-row">
        <div class="grid-cell" />
        <div class="grid-cell" />
        <div class="grid-cell" />
        <div class="grid-cell" />
      </div>
      <div class="grid-row">
        <div class="grid-cell" />
        <div class="grid-cell" />
        <div class="grid-cell" />
        <div class="grid-cell" />
      </div>
    </div>

    <div class="tile-container" />
  </div>

  <p class="game-explanation">
    <strong class="important">How to play:</strong> Use your
    <strong>arrow keys</strong>
    to move the tiles. When two tiles with the same number touch, they
    <strong>merge into one!</strong>
  </p>
</main>

<style lang="scss">
</style>
