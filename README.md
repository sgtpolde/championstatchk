# Description

NestJS application providing API endpoints for champion and patch information.


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
  - [Patch Endpoints](#patch-endpoints)
  - [Champion Endpoints](#champion-endpoints)


---

# Installation

```sh
git clone https://github.com/sgtpolde/championstatchk.git
cd championstatchk
cd backend
npm install
```
To start the application:
```sh
npm run start
or
npm run start:dev
```

#  Usage
Description ~ tbd

# Endpoints
### Patch Endpoints
##### Get latest patch

<details>
 <summary><code>GET</code> <code><b>/patches/latest</b></code> <code>(Get latest patch)</code></summary>

##### Parameters

> None


##### Response codes

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `text/plain;charset=UTF-8`        | `Configuration created successfully`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example request

> ```
>  http://localhost:8000/patches/latest
> ```

##### Example response

> ```
>  13.22.1
> ```

</details>



##### Get all patches

<details>
 <summary><code>GET</code> <code><b>/patches/all</b></code> <code>(Get all patches)</code></summary>

##### Parameters

> None


##### Response codes

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `text/plain;charset=UTF-8`        | `Configuration created successfully`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example request

> ```
>  http://localhost:8000/patches/update
> ```

##### Example response

> ```json
>  [
>    {
>        "id": "3906d99c-4c11-4160-98e3-272cc6773d54",
>        "version": "13.22.1",
>        "currentPatch": true
>    },
>    {
>        "id": "c7dbfa45-f819-46bd-b290-19010d5a0d4c",
>        "version": "13.21.1",
>        "currentPatch": false
>    },
>    {
>        "id": "6a16ba5d-468b-440d-8b41-5775c800b833",
>        "version": "13.20.1",
>        "currentPatch": false
>    },
>    {
>        "id": "db65b183-d8dc-4733-b04c-cbf6942e3173",
>        "version": "13.19.1",
>        "currentPatch": false
>    },
>  	{...}
> ]
> ```

</details>



##### Update patches (Chron job or manual)

<details>
 <summary><code>GET</code> <code><b>/patches/update</b></code> <code>(Update patches)</code></summary>

##### Parameters

> None


##### Response codes

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `text/plain;charset=UTF-8`        | `Configuration created successfully`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example request

> ```
>  http://localhost:8000/patches/update
> ```

##### Example response

> ```
> 	13.23.1 (returns the latest patch)
> ```

</details>

------------------------------------------------------------------------------------------


#### Champion Endpoints
```
Get all champions: GET /champion
Initialize champion stats: GET /champion/initialize
Save champion patch data: GET /champion/:patchVersion/:championId
Get all champion spells: GET /champion/:patchVersion/:championId/allinfo
Get champion spells: GET /champion/:patchVersion/:championId/spells
Compare champion spells: GET /champion/compare/:championId/:patch1/:patch2
```
### Champion Endpoints (w.i.p.)
##### Get all champions

<details>
 <summary><code>GET</code> <code><b>/champion/all</b></code> <code>(Get all champions)</code></summary>

##### Parameters

> None


##### Response codes

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `text/plain;charset=UTF-8`        | `Configuration created successfully`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example request

> ```
>  http://localhost:8000/champions/all
> ```

##### Example response

> ```json
>  [
>    {
>        "id": "e1bc54b8-74ac-46ba-a21d-dd74c2d4a8ef",
>        "key": "523",
>        "name": "Aphelios",
>        "title": "the Weapon of the Faithful",
>        "blurb": "Emerging from moonlight's shadow with weapons drawn, Aphelios kills the enemies of his faith in brooding > > silence—speaking only through the certainty of his aim, and the firing of each gun. Though fueled by a poison that renders > him mute, he is guided by...",
>        "image": {
>            "h": 48,
>            "w": 48,
>            "x": 384,
>            "y": 0,
>            "full": "Aphelios.png",
>            "group": "champion",
>            "sprite": "champion0.png"
>        }
>    },
>    {
>        "id": "91c3b6c4-b365-4d16-9c4a-00a0f2a476ca",
>        "key": "22",
>        "name": "Ashe",
>        "title": "the Frost Archer",
>        "blurb": "Iceborn warmother of the Avarosan tribe, Ashe commands the most populous horde in the north. Stoic,   >intelligent, and idealistic, yet uncomfortable with her role as leader, she taps into the ancestral magics of her lineage to >wield a bow of True Ice...",
>        "image": {
>            "h": 48,
>            "w": 48,
>            "x": 432,
>            "y": 0,
>            "full": "Ashe.png",
>            "group": "champion",
>            "sprite": "champion0.png"
>        }
>    },
>    {...}
> ```

</details>


##### Initialize champion stats

<details>
 <summary><code>GET</code> <code><b>/champion/initialize</b></code> <code>(Initialize champion stats)</code></summary>

##### Parameters

> None


##### Response codes

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `text/plain;charset=UTF-8`        | `Configuration created successfully`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example request

> ```
>  http://localhost:8000/champion/initialize
> ```

##### Example response

> ```
>  Champion stats saved successfully.
> ```

</details>


