const ChestPainData = {
    "graph": {
        "CHP0001": [
            1,
            2,
            3
        ],
        "CHP0002": [
            4
        ],
        "CHP0003": [
            5
        ],
        "CHP0004": [
            6
        ],
        "CHP0005": [
            7
        ],
        "CHP0006": [
            8
        ],
        "CHP0008": [],
        "CHP0007": [
            9
        ]
    },
    "nodes": {
        "CHP0001": {
            "uid": "5a5f55dc352f439a8b7f3c2906f34087",
            "medID": "CHP0001",
            "category": "CHEST_PAIN",
            "creationTime": "2019-09-08 23:35:07.261916+00:00",
            "text": "Do you have chest pain?",
            "responseType": "YES-NO"
        },
        "CHP0002": {
            "uid": "10b1510047b34734aa9f4d5c50147cd0",
            "medID": "CHP0002",
            "category": "CHEST_PAIN",
            "creationTime": "2019-09-08 23:35:07.265977+00:00",
            "text": "Are any of the following symptoms associated with your chest pain: CLICK[weakness, fatigue, cold sweat, dizziness, nausea, vomiting, indigestion, clammy feeling, fainting, light-headedness]",
            "responseType": "CLICK-BOXES"
        },
        "CHP0003": {
            "uid": "428013850b2b414fb82c489abac1069f",
            "medID": "CHP0003",
            "category": "CHEST_PAIN",
            "creationTime": "2019-09-08 23:35:07.270127+00:00",
            "text": "Do you have a history of: CLICK[heart disease, high blood pressure, smoking, high cholesterol, diabetes]",
            "responseType": "CLICK-BOXES"
        },
        "CHP0004": {
            "uid": "67b2fa33124e4ef582c85fda72f1a93c",
            "medID": "CHP0004",
            "category": "CHEST_PAIN",
            "creationTime": "2019-09-08 23:35:07.274632+00:00",
            "text": "Does anyone in your family have heart disease?",
            "responseType": "YES-NO"
        },
        "CHP0005": {
            "uid": "8dc63641b9a344548349691e281e677d",
            "medID": "CHP0005",
            "category": "CHEST_PAIN",
            "creationTime": "2019-09-08 23:35:07.279163+00:00",
            "text": "Are you taking any of the following substances: CLICK[blood pressure medicine, beta blockers, calcium channel blockers, digoxin, diuretics, aspirin, anticoagulants, over-the-counter drugs, herbal supplements, recreational drugs]",
            "responseType": "CLICK-BOXES"
        },
        "CHP0006": {
            "uid": "8cedb362d9f546148e5da061f4f7e024",
            "medID": "CHP0006",
            "category": "CHEST_PAIN",
            "creationTime": "2019-09-08 23:35:07.282443+00:00",
            "text": "Does the pain get worse with any of the following: [exercise, cold, emotional stress, sexual intercourse, smoking, swallowing, after meals]",
            "responseType": "CLICK-BOXES"
        },
        "CHP0008": {
            "uid": "448ef121854b44289d61b30820747b62",
            "medID": "CHP0008",
            "category": "CHEST_PAIN",
            "creationTime": "2019-09-08 23:35:07.287368+00:00",
            "text": "Does the pain get better with sitting up and leaning forward?",
            "responseType": "YES-NO"
        },
        "CHP0007": {
            "uid": "2d3de98f2d814b1dacbc0547afd4e5ff",
            "medID": "CHP0007",
            "category": "CHEST_PAIN",
            "creationTime": "2019-09-08 23:35:07.291611+00:00",
            "text": "Does the pain feel like any of the following: [squeezing, tightness, pressure, constriction, burning]",
            "responseType": "CLICK-BOXES"
        }
    },
    "edges": {
        "1": {
            "from": "JNT0001",
            "to": "CHP0001"
        },
        "2": {
            "from": "HDK0001",
            "to": "CHP0001"
        },
        "3": {
            "from": "CHP0001",
            "to": "CHP0001"
        },
        "4": {
            "from": "CHP0001",
            "to": "CHP0002"
        },
        "5": {
            "from": "CHP0001",
            "to": "CHP0003"
        },
        "6": {
            "from": "CHP0001",
            "to": "CHP0004"
        },
        "7": {
            "from": "CHP0001",
            "to": "CHP0005"
        },
        "8": {
            "from": "CHP0001",
            "to": "CHP0006"
        },
        "9": {
            "from": "CHP0001",
            "to": "CHP0007"
        }
    }
}

    export default ChestPainData