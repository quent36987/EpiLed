<script lang="ts">
    import { Button } from 'flowbite-svelte';
    export let text: string;
    export let handleClick: () => void;
  </script>
  
  <Button class="custom-button" on:click={handleClick}>
    {text}
  </Button>
  
  <style>
    .custom-button {
      background-color: #4CAF50;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      transition-duration: 0.4s;
    }
    
    .custom-button:hover {
      background-color: white;
      color: black;
    }
  </style>
  