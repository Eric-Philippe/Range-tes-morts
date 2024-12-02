# Range tes morts - Bring out your dead

## Useful curl commands

### Step 1: Create a lot

```bash
curl -X POST http://localhost:3000/lots -H "Content-Type: application/json" -d '{
    "name": "Lot A"
}'
```

### Step 2: Add graves to the lot

```bash
curl -X POST http://localhost:3000/graves -H "Content-Type: application/json" -d '{
    "state": 0,
    "lot_id": 1,
    "number": 1
}'
```

### Step 3: Add a deceased to the grave

```bash
curl -X POST http://localhost:3000/lots/PERPETUAL/graves/49/deads -H "Content-Type: application/json" -d '{
    "firstname": "John",
    "lastname": "Doe",
    "entrydate": "2023-10-01T00:00:00Z",
    "state": 1
}'
```

### Step 4: Get all the lots

```bash
curl http://localhost:3000/lots
```

### Step 5: Get the newly created lot

```bash
curl http://localhost:3000/lot/1
```
