<script>
  let selectedNoteId = parseInt(localStorage.getItem("selected-note")) || 0;

  let notes = JSON.parse(localStorage.getItem("notes-liist")) || [];

  let getNote = notes.filter((note) => note.id === selectedNoteId);
  let editorBind = getNote.text;

  const createNote = () => {
    const noteObject = {
      id: Date.now(),
      text: "",
    };

    notes = [noteObject, ...notes];

    localStorage.setItem("notes-liist", JSON.stringify(notes));
  };
</script>

<main>
  <div class="modal-container">
    <div class="header">
      <h2 style="font-size: 1.1em; font-weight: 500;">Notes</h2>
      <p>[]</p>
    </div>

    <!-- <textarea
      on:keyup={() => {
        localStorage.setItem("noteee", editorBind);
      }}
      class="editor"
      bind:value={editorBind}
    /> -->

    <div class="notes-container">
      <div class="notes-list">
        <button on:click={createNote}>+ ADD</button>

        {#each notes as note, i (note.id)}
          <div
            on:click={() => {
              selectedNoteId = note.id;
              editorBind = note.text;
              localStorage.setItem("selected-note", note.id);
            }}
            class:selected-note={note.id === selectedNoteId}
            class="note-list-element"
          >
            <p>{note.text}</p>
          </div>
        {/each}
      </div>

      <div
        class="editor"
        role="textbox"
        contenteditable
        bind:innerHTML={editorBind}
        on:keyup={() => {
          //localStorage.setItem("noteee", editorBind);
        }}
      >
        Your default value
      </div>
    </div>
  </div>
</main>

<style>
  main {
    width: 100%;
  }

  .modal-container {
    position: relative;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
    background-color: #f2f2f2;
    color: black;
    box-shadow: 0px 1px 3px 2px rgba(0, 0, 0, 0.08);
  }

  .header {
    padding: 1rem;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(180, 180, 180, 0.3);
  }

  .editor {
    background-color: white;
    color: black;
    width: 100%;
    height: 100%;
    padding: 1rem;
    line-height: 1.3;
  }

  .editor:focus {
    border: none;
    outline: none;
  }

  .notes-container {
    display: flex;
  }

  .notes-list {
    width: 180px;
    margin: 0.6rem;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .note-list-element {
    width: 100%;
    height: 90px;
    border: 1px solid transparent;
    border-radius: 5px;
    background-color: white;
    margin: 0.4rem 0;
  }

  .note-list-element p {
    margin: 0.6rem;
  }

  .selected-note {
    border-color: black;
  }

  @media (prefers-color-scheme: dark) {
    .modal-container {
      background-color: #333;
      color: white;
    }

    .header {
      background-color: rgb(24, 24, 24);
    }
  }
</style>
