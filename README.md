# Blog API
API de entradas de blog realizada con Node y Express, usando MySQL y Sequelize para persistencia de los datos.

## Ejecutar el proyecto localmente
1. Clonar el repositorio
2. Instalar dependencias con `npm install`
3. Crear un archivo `.env` con la configuración necesaria para la base de datos. Ejemplo:
    ```
    DEBUG=blog-api:*
    PORT=3001
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USER=root
    MYSQL_PASS=example
    MYSQL_DB=blog_api
    ```
4. Ejecutar el servidor en modo desarrollo con `npm run dev` o en modo producción con `npm start`. Al ejecutarse, el servidor crea las tablas necesarias en la base de datos si estas no existen. Por defecto, el servidor estará escuchando en http://localhost:3001.

## Endpoints
Todos los endpoints devuelven datos de tipo `application/json`. Para los endpoints que reciben datos, el formato del body también debe ser `application/json`.

La documentación completa generada con Swagger UI se puede visualizar en http://localhost:3001/docs, donde también pueden probarse los endpoints.

* **POST** `/api/posts`: Crea un nuevo post.
* **GET** `/api/posts`: Obtiene los detalles todos los posts, salvo su contenido.
* **GET** `/api/posts/{id}`: Obtiene los detalles del post especificado, incluyendo el contenido del mismo.
* **PATCH** `/api/posts/{id}`: Actualiza los campos de un post.
* **DELETE** `/api/posts/{id}`: Elimina un post.

La estructura de cada post es la siguiente:
* `id` (int, read-only): ID autogenerado del post.
* `title` (string): Título del post.
* `content` (string): Contenido del post.
* `imageUrl` (string): URL de la imagen asociada a este post. Se aceptan URLs HTTP(S) que hagan referencia a un archivo con extensión `.png`/`.jpg`/`.gif`/`.webp`.
* `category` (string, write-only): Nombre de la categoría que se quiere asignar al post.
* `category` (object, read-only): Información de la categoría asignada a este post. Contiene las propiedades `id` y `name`.
----
Al completarse exitosamente, las operaciones de creación devuelven código `201`, las modificaciones devuelven código `200`, y las eliminaciones devuelven código `204`.

En caso de que el ID ingresado en el path para las operaciones de modificación o eliminación no exista, se devolverá el código de estado `404`. Asimismo, para las operaciones de escritura, si los datos ingresados en el *body* no tienen la estructura correcta, se devolverá código 422.

