import json,sqlite3,sys
from pathlib import Path
data=json.load(sys.stdin)
db=sqlite3.connect(data['file']);db.row_factory=sqlite3.Row
try:
    if data.get('schema'): db.executescript(Path(data['schema']).read_text(encoding='utf-8'))
    results=[]
    for q in data.get('queries',[]):
        cur=db.execute(q['sql'],q.get('args',[]))
        rows=[dict(r) for r in cur.fetchall()] if cur.description else []
        results.append({'results':rows,'meta':{'changes':max(cur.rowcount,0)}})
    db.commit();print(json.dumps({'results':results}))
except Exception as e:
    db.rollback();print(json.dumps({'error':str(e)}));sys.exit(1)
finally: db.close()
