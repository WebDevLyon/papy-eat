<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="css/style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <header>
        <h1>Papy-Eat</h1>
</header>
    <main>
        <h2>Bon de commande</h2>
        <section>
            <form action="" method="POST">
                <fieldset>
                  <legend>Choix des produits</legend>
                  <p>
                    <input type="radio" name="salade" id="r-salade" value="Salade">
                    <label for="r-salade">Salade</label>
                  </p>
                  <p>
                    <input type="radio" name="size" id="r-oeuf" value="Oeuf">
                    <label for="r-oeuf">Oeuf</label>
                  </p>
                  <p>
                    <input type="radio" name="size" id="r-poiree" value="Poiree">
                    <label for="r-poiree">Poirée</label>
                  </p>
                  <p>
                    <input type="radio" name="size" id="size_3" value="Oseille">
                    <label for="size_3">Oseille</label>
                  </p>
                  <p>
                    <input type="radio" name="size" id="size_3" value="Persil">
                    <label for="size_3">Persil</label>
                  </p>
                  <p>
                    <input type="radio" name="size" id="size_3" value="Roquette">
                    <label for="size_3">Roquette</label>
                  </p>
                  <p>
                    <input type="radio" name="size" id="size_3" value="Autre">
                    <label for="size_3">Autre</label>
                  </p>
                </fieldset>
              </form>
              <?php
              if (isset($_POST['message'])) {
                  $position_arobase = strpos($_POST['email'], '@');
                  if ($position_arobase === false)
                      echo '<p>Votre email doit comporter un arobase.</p>';
                  else {
                      $retour = mail('lachise.nicolas@gmail.com , 'Envoi depuis la page Contact', $_POST['salade'], 'From: ' . $_POST['email']);
                      if($retour)
                          echo '<p>Votre message a été envoyé.</p>';
                      else
                          echo '<p>Erreur.</p>';
                  }
              }
              ?>
        </section>
    </main>
</body>
</html>