<template>
  <div class="content">
    <section class="decoration-item">
      <div class="book">
        <span class="page turn"></span>
        <span class="page turn"></span>
        <span class="page turn"></span>
        <span class="page turn"></span>
        <span class="page turn"></span>
        <span class="page turn"></span>
        <span class="cover"></span>
        <span class="page"></span>
        <span class="cover turn"></span>
      </div>
    </section>
    <section class="decoration-item">
      <div class="typing-demo">
        Welcome to Sirice's FrontEnd Playground!
      </div>
    </section>
    <p>Click Menu button on right top to visit demos</p>
    <p>Author&nbsp;<a href="https://github.com/Siricee">@Sirice</a></p>
  </div>
</template>
<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: beige;

  .decoration-item {
    width: 40%;
    height: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .book {
    position: relative;
    margin: auto;
    width: 18.5rem;
    height: 12.5rem;
    perspective: 70rem;

    .cover {
      background-color: #36354e;
      transform: rotateY(0deg);
      width: 9.25rem;
      height: 12.5rem;
    }
    .page {
      top: 0.25rem;
      left: 0.25rem;
      background-color: #e9e6c4;
      transform: rotateY(0deg);
      width: 9rem;
      height: 12rem;
      text-align: right;
      font-size: 8px;
      color: #777;
      font-family: monospace;
    }
    .page::before,
    .page::after {
      display: block;
      border-top: 1px dashed rgba(0, 0, 0, 0.3);
      content: "";
      padding-bottom: 1rem;
    }
    .cover,
    .page {
      position: absolute;
      padding: 1rem;
      transform-origin: 100% 0;
      border-radius: 5px 0 0 5px;
      box-shadow: inset 3px 0px 20px rgba(0, 0, 0, 0.2),
        0px 0px 15px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }
    .cover.turn {
      animation: bookCover 3s forwards;
    }
    .page.turn {
      animation: bookOpen 3s forwards;
    }
    .page:nth-of-type(1) {
      animation-delay: 0.05s;
    }
    .page:nth-of-type(2) {
      animation-delay: 0.33s;
    }
    .page:nth-of-type(3) {
      animation-delay: 0.66s;
    }
    .page:nth-of-type(4) {
      animation: bookOpen150deg 3s forwards;
      animation-delay: 0.99s;
    }
    .page:nth-of-type(5) {
      animation: bookOpen30deg 3s forwards;
      animation-delay: 1.2s;
    }
    .page:nth-of-type(6) {
      animation: bookOpen55deg 3s forwards;
      animation-delay: 1.25s;
    }
    @keyframes bookOpen {
      30% {
        z-index: 999;
      }
      100% {
        transform: rotateY(180deg);
        z-index: 999;
      }
    }
    @keyframes bookCover {
      30% {
        z-index: 999;
      }
      100% {
        transform: rotateY(180deg);
        z-index: 1;
      }
    }
    @keyframes bookOpen150deg {
      30% {
        z-index: 999;
      }
      100% {
        transform: rotateY(150deg);
        z-index: 999;
      }
    }
    @keyframes bookOpen55deg {
      30% {
        z-index: 999;
      }
      100% {
        transform: rotateY(55deg);
        z-index: 999;
      }
    }
    @keyframes bookOpen30deg {
      50% {
        z-index: 999;
      }
      100% {
        transform: rotateY(30deg);
        z-index: 999;
      }
    }
  }
  .typing-demo {
    @keyframes typing {
      from {
        width: 0;
      }
    }

    @keyframes blink {
      50% {
        border-color: transparent;
      }
    }
    width: 35ch;
    animation: typing 2s steps(22), blink 0.5s step-end infinite alternate;
    white-space: nowrap;
    overflow: hidden;
    border-right: 3px solid;
    font-size: 2em;
  }
}
</style>
