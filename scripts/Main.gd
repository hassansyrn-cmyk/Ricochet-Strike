extends Node2D

const W := 1080.0
const H := 1920.0
const SAVE_PATH := "user://ricochet_save.json"
const COLORS := {
    "bg": Color("071324"), "panel": Color("10243c"), "cyan": Color("38e4ff"),
    "red": Color("ff496c"), "gold": Color("ffd45c"), "glass": Color(0.4,0.9,1.0,0.45),
    "white": Color("eef8ff"), "green": Color("55f59a"), "purple": Color("b96cff")
}

enum Screen { HOME, LEVELS, GAME, RESULT, SHOP, DAILY }
var screen := Screen.HOME
var level_id := 1
var unlocked := 1
var coins := 0
var stars: Dictionary = {}
var selected_ball := 0
var owned_balls := [0]
var sound_on := true
var vibration_on := true
var daily_stamp := ""

var launcher := Vector2(540, 1650)
var ball_pos := launcher
var ball_vel := Vector2.ZERO
var ball_active := false
var ball_radius := 18.0
var bounce_count := 0
var ammo := 3
var aim_start := Vector2.ZERO
var aim_current := Vector2.ZERO
var dragging := false
var trajectory: Array[Vector2] = []
var target := {"pos":Vector2(760,520),"base":Vector2(760,520),"radius":42.0,"move":0.0,"speed":0.0,"shield":false,"shield_angle":0.0}
var walls: Array[Dictionary] = []
var hazards: Array[Dictionary] = []
var glass: Array[Dictionary] = []
var portals: Array[Dictionary] = []
var wells: Array[Dictionary] = []
var particles: Array[Dictionary] = []
var shots_used := 0
var required_bounces := 1
var level_time := 0.0
var time_limit := 0.0
var portal_lock := 0.0
var shake := 0.0
var hit_flash := 0.0
var message := ""
var result_win := false
var result_score := 0
var result_stars := 0
var buttons: Array[Dictionary] = []
var rng := RandomNumberGenerator.new()

func _ready() -> void:
    rng.randomize()
    _load_save()
    set_process(true)
    queue_redraw()

func _process(delta: float) -> void:
    if screen == Screen.GAME:
        _update_game(delta)
    _update_particles(delta)
    shake = move_toward(shake, 0.0, delta * 30.0)
    hit_flash = move_toward(hit_flash, 0.0, delta * 4.0)
    queue_redraw()

func _unhandled_input(event: InputEvent) -> void:
    var pos := Vector2.ZERO
    var pressed := false
    var released := false
    var moving := false
    if event is InputEventScreenTouch:
        pos = event.position
        pressed = event.pressed
        released = not event.pressed
    elif event is InputEventScreenDrag:
        pos = event.position
        moving = true
    elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
        pos = event.position
        pressed = event.pressed
        released = not event.pressed
    elif event is InputEventMouseMotion and dragging:
        pos = event.position
        moving = true
    else:
        return
    if pressed:
        if _press_button(pos): return
        if screen == Screen.GAME and not ball_active:
            dragging = true
            aim_start = pos
            aim_current = pos
    elif moving and dragging:
        aim_current = pos
        _predict((aim_start - aim_current).normalized())
    elif released and dragging:
        dragging = false
        trajectory.clear()
        var pull := aim_start - pos
        if pull.length() >= 45.0:
            _shoot(pull.normalized(), clampf(pull.length() / 300.0, 0.45, 1.0))

func _press_button(pos: Vector2) -> bool:
    for b in buttons:
        if (b.rect as Rect2).has_point(pos):
            _action(str(b.action), int(b.get("value",0)))
            return true
    return false

func _action(action: String, value: int) -> void:
    match action:
        "play": screen = Screen.LEVELS
        "levels": screen = Screen.LEVELS
        "home": screen = Screen.HOME
        "level": _start_level(value)
        "restart": _start_level(level_id)
        "next": _start_level(mini(level_id + 1, 100))
        "shop": screen = Screen.SHOP
        "daily": screen = Screen.DAILY
        "claim_daily": _claim_daily()
        "ball": _select_or_buy(value)
        "sound": sound_on = not sound_on; _save()
        "vibrate": vibration_on = not vibration_on; _save()
    queue_redraw()

func _start_level(id: int) -> void:
    level_id = clampi(id, 1, 100)
    screen = Screen.GAME
    result_win = false
    result_score = 0
    shots_used = 0
    level_time = 0.0
    message = "BOUNCE FIRST"
    _generate_level(level_id)
    ball_pos = launcher
    ball_vel = Vector2.ZERO
    ball_active = false
    dragging = false
    trajectory.clear()

func _generate_level(id: int) -> void:
    walls.clear(); hazards.clear(); glass.clear(); portals.clear(); wells.clear()
    var world := int((id - 1) / 20) + 1
    var local := (id - 1) % 20 + 1
    ammo = 4 if world <= 2 else 3
    if id >= 91: ammo = 2
    required_bounces = 1 if world == 1 else (2 if world <= 3 else 3)
    if id >= 96: required_bounces = 4
    time_limit = 12.0 if world == 5 and local > 10 else 0.0
    var tx := 230.0 + float((id * 137) % 620)
    target = {"pos":Vector2(tx, 390 + (id % 4) * 80), "base":Vector2(tx,390 + (id % 4)*80), "radius":42.0,
        "move": 120.0 if world >= 2 else 0.0, "speed":0.8 + local*0.035, "shield":world >= 4, "shield_angle":0.0}
    walls.append(_rect(Vector2(540, 1130), Vector2(720, 36), deg_to_rad(-22.0 + (id%5)*11.0), "wall"))
    if local > 4: walls.append(_rect(Vector2(180 if id%2==0 else 900, 820), Vector2(300,34), deg_to_rad(55 if id%2==0 else -55), "wall"))
    if local > 10: walls.append(_rect(Vector2(540,650), Vector2(270,30), deg_to_rad((id%3-1)*32), "wall"))
    if world >= 2:
        hazards.append(_rect(Vector2(540,1370), Vector2(260 + local*8, 28), 0.0, "hazard"))
        glass.append(_rect(Vector2(300 + (id%3)*220, 930), Vector2(150,24), deg_to_rad((id%2)*35-18), "glass"))
    if world >= 3:
        portals = [{"pos":Vector2(220,760),"pair":1,"radius":38.0},{"pos":Vector2(860,920),"pair":1,"radius":38.0}]
        wells = [{"pos":Vector2(540,780),"radius":180.0,"strength":430.0 + local*12.0}]
    if world == 5 and local > 5:
        walls.append(_rect(Vector2(540,520), Vector2(260,24), deg_to_rad(15), "blink", 1.2 + (local%3)*0.2))

func _rect(pos: Vector2, size: Vector2, rot: float, kind: String, cycle := 0.0) -> Dictionary:
    return {"pos":pos,"size":size,"rot":rot,"kind":kind,"alive":true,"cycle":cycle}

func _shoot(dir: Vector2, power: float) -> void:
    if ball_active or ammo <= 0: return
    ammo -= 1
    shots_used += 1
    bounce_count = 0
    ball_pos = launcher
    var speeds := [1260.0, 1120.0, 1320.0, 1200.0, 1250.0, 1280.0]
    ball_vel = dir * speeds[selected_ball] * power
    ball_active = true
    portal_lock = 0.0
    message = ""
    _burst(ball_pos, COLORS.cyan, 10)

func _update_game(delta: float) -> void:
    level_time += delta
    portal_lock = maxf(0.0, portal_lock - delta)
    target.shield_angle = float(target.shield_angle) + delta * 1.4
    if float(target.move) > 0.0:
        target.pos.x = target.base.x + sin(level_time * float(target.speed)) * float(target.move)
    if time_limit > 0.0 and level_time >= time_limit:
        _lose("TIME UP")
        return
    if not ball_active: return
    for well in wells:
        var d: Vector2 = well.pos - ball_pos
        if d.length() < float(well.radius) and d.length() > 5.0:
            ball_vel += d.normalized() * float(well.strength) * delta
    var steps := 4
    var step_delta := delta / steps
    for i in range(steps):
        var previous := ball_pos
        ball_pos += ball_vel * step_delta
        if _check_target(previous, ball_pos): return
        if _check_portals(): pass
        if _check_rect_collisions(walls, true): pass
        if _check_rect_collisions(glass, true): pass
        if _check_rect_collisions(hazards, false): return
        if ball_pos.x < 18.0 or ball_pos.x > W-18.0:
            ball_pos.x = clampf(ball_pos.x,18.0,W-18.0); ball_vel.x *= -0.92; _bounce_fx()
        if ball_pos.y < 245.0:
            ball_pos.y = 245.0; ball_vel.y = absf(ball_vel.y)*0.92; _bounce_fx()
        if ball_pos.y > H+100.0:
            _miss(); return
    ball_vel *= pow(0.996, delta*60.0)
    if ball_vel.length() < 65.0: _miss()

func _check_rect_collisions(items: Array[Dictionary], bouncy: bool) -> bool:
    for item in items:
        if not bool(item.alive): continue
        if str(item.kind) == "blink" and fmod(level_time, float(item.cycle)*2.0) > float(item.cycle): continue
        var local: Vector2 = (ball_pos - item.pos).rotated(-float(item.rot))
        var half: Vector2 = item.size * 0.5
        if absf(local.x) <= half.x + ball_radius and absf(local.y) <= half.y + ball_radius:
            if not bouncy:
                _lose("HAZARD HIT"); return true
            var px := half.x + ball_radius - absf(local.x)
            var py := half.y + ball_radius - absf(local.y)
            var n_local := Vector2(signf(local.x),0) if px < py else Vector2(0,signf(local.y))
            if n_local == Vector2.ZERO: n_local = Vector2.UP
            var normal := n_local.rotated(float(item.rot)).normalized()
            ball_pos += normal * minf(px,py)
            ball_vel = ball_vel.bounce(normal) * 0.92
            if str(item.kind) == "glass" and (selected_ball == 1 or ball_vel.length() > 850):
                item.alive = false
                _burst(ball_pos,COLORS.glass,22)
            _bounce_fx()
            return true
    return false

func _check_target(a: Vector2, b: Vector2) -> bool:
    if _segment_distance(target.pos,a,b) > float(target.radius)+ball_radius: return false
    if bool(target.shield):
        var incoming := (a-target.pos).angle()
        var gap_center := float(target.shield_angle)
        var gap := absf(wrapf(incoming-gap_center,-PI,PI))
        if gap > deg_to_rad(55):
            var n := (ball_pos-target.pos).normalized()
            ball_vel = ball_vel.bounce(n)*0.88
            ball_pos = target.pos+n*(float(target.radius)+ball_radius+2)
            _bounce_fx(); message="SHIELD BLOCK"; return false
    if bounce_count < required_bounces:
        _lose("DIRECT HIT FORBIDDEN" if bounce_count == 0 else "NEED %d BOUNCES" % required_bounces)
    else:
        _win()
    return true

func _check_portals() -> bool:
    if portal_lock > 0.0: return false
    for i in range(portals.size()):
        if ball_pos.distance_to(portals[i].pos) < float(portals[i].radius)+ball_radius:
            var other := 1-i if portals.size()==2 else i
            ball_pos = portals[other].pos + ball_vel.normalized()*55.0
            portal_lock = 0.35
            _burst(ball_pos,COLORS.purple,18)
            return true
    return false

func _segment_distance(p: Vector2, a: Vector2, b: Vector2) -> float:
    var ab := b-a
    if ab.length_squared() < 0.001: return p.distance_to(a)
    var t := clampf((p-a).dot(ab)/ab.length_squared(),0.0,1.0)
    return p.distance_to(a+ab*t)

func _bounce_fx() -> void:
    bounce_count += 1
    shake = minf(12.0, 2.0 + ball_vel.length()/170.0)
    message = "x%d" % int(pow(2,bounce_count-1))
    _burst(ball_pos,COLORS.gold,8+mini(bounce_count,8))
    if vibration_on: Input.vibrate_handheld(18)

func _miss() -> void:
    ball_active = false
    ball_pos = launcher
    if ammo <= 0: _lose("OUT OF AMMO")
    else: message = "TRY AGAIN"

func _win() -> void:
    ball_active = false
    result_win = true
    hit_flash = 1.0
    shake = 18.0
    if vibration_on: Input.vibrate_handheld(45)
    _burst(target.pos,COLORS.gold,45)
    var target_shots := 1 if level_id < 31 else 2
    result_stars = 1
    if shots_used <= target_shots+1: result_stars = 2
    if shots_used <= target_shots and bounce_count >= required_bounces+1: result_stars = 3
    result_score = 100*int(pow(2,bounce_count)) + ammo*250 + result_stars*500
    coins += 20 + result_stars*10
    stars[str(level_id)] = maxi(int(stars.get(str(level_id),0)),result_stars)
    unlocked = maxi(unlocked,mini(100,level_id+1))
    _save()
    await get_tree().create_timer(0.16).timeout
    screen = Screen.RESULT

func _lose(reason: String) -> void:
    if screen != Screen.GAME: return
    ball_active = false
    result_win = false
    message = reason
    result_score = 0
    result_stars = 0
    await get_tree().create_timer(0.35).timeout
    screen = Screen.RESULT

func _predict(dir: Vector2) -> void:
    trajectory.clear()
    if dir == Vector2.ZERO: return
    var p := launcher
    var v := dir
    trajectory.append(p)
    for n in range(5):
        var best_t := 1500.0
        var hit_n := Vector2.ZERO
        for item in walls:
            if not bool(item.alive): continue
            var hit := _ray_rotated_rect(p,v,item)
            if hit.x > 0.0 and hit.x < best_t:
                best_t=hit.x; hit_n=Vector2(hit.y,hit.z)
        if hit_n == Vector2.ZERO:
            trajectory.append(p+v*best_t); break
        p += v*best_t
        trajectory.append(p)
        v = v.bounce(hit_n).normalized()
        p += v*1.0

func _ray_rotated_rect(origin: Vector2, dir: Vector2, item: Dictionary) -> Vector3:
    var o := (origin-item.pos).rotated(-float(item.rot))
    var d := dir.rotated(-float(item.rot))
    var h: Vector2 = item.size*0.5
    var tx1 := (-h.x-o.x)/d.x if absf(d.x)>0.0001 else -INF
    var tx2 := (h.x-o.x)/d.x if absf(d.x)>0.0001 else INF
    var ty1 := (-h.y-o.y)/d.y if absf(d.y)>0.0001 else -INF
    var ty2 := (h.y-o.y)/d.y if absf(d.y)>0.0001 else INF
    var tmin := maxf(minf(tx1,tx2),minf(ty1,ty2))
    var tmax := minf(maxf(tx1,tx2),maxf(ty1,ty2))
    if tmax < 0.0 or tmin > tmax: return Vector3(-1,0,0)
    var hit := o+d*tmin
    var nl := Vector2(signf(hit.x),0) if absf(absf(hit.x)-h.x)<2.0 else Vector2(0,signf(hit.y))
    var nw := nl.rotated(float(item.rot))
    return Vector3(tmin,nw.x,nw.y)

func _burst(pos: Vector2, color: Color, count: int) -> void:
    for i in range(count):
        var a := rng.randf_range(0,TAU)
        particles.append({"pos":pos,"vel":Vector2.from_angle(a)*rng.randf_range(80,360),"life":rng.randf_range(.25,.7),"color":color})

func _update_particles(delta: float) -> void:
    for i in range(particles.size()-1,-1,-1):
        particles[i].pos += particles[i].vel*delta
        particles[i].vel *= 0.94
        particles[i].life -= delta
        if particles[i].life <= 0: particles.remove_at(i)

func _draw() -> void:
    buttons.clear()
    var off := Vector2(rng.randf_range(-shake,shake),rng.randf_range(-shake,shake)) if shake>0 else Vector2.ZERO
    draw_set_transform(off)
    draw_rect(Rect2(0,0,W,H),COLORS.bg)
    _draw_grid()
    match screen:
        Screen.HOME: _draw_home()
        Screen.LEVELS: _draw_levels()
        Screen.GAME: _draw_game()
        Screen.RESULT: _draw_result()
        Screen.SHOP: _draw_shop()
        Screen.DAILY: _draw_daily()
    draw_set_transform(Vector2.ZERO)
    if hit_flash>0: draw_rect(Rect2(0,0,W,H),Color(1,1,1,hit_flash*.28))

func _draw_grid() -> void:
    for x in range(0,1081,90): draw_line(Vector2(x,0),Vector2(x,H),Color(0.1,0.35,0.5,0.08),1)
    for y in range(0,1921,90): draw_line(Vector2(0,y),Vector2(W,y),Color(0.1,0.35,0.5,0.08),1)

func _draw_home() -> void:
    _text("RICOCHET",Vector2(540,300),78,COLORS.white,true)
    _text("STRIKE",Vector2(540,390),96,COLORS.cyan,true)
    _text("DIRECT HITS ARE FORBIDDEN",Vector2(540,470),24,COLORS.gold,true)
    draw_circle(Vector2(540,700),105,Color(0.05,0.5,0.8,0.18))
    draw_circle(Vector2(540,700),42,COLORS.cyan)
    draw_arc(Vector2(540,700),91,0,TAU,64,COLORS.cyan,5)
    _button(Rect2(240,930,600,120),"PLAY","play",0,COLORS.cyan)
    _button(Rect2(240,1080,285,100),"BALLS","shop",0,COLORS.panel)
    _button(Rect2(555,1080,285,100),"DAILY","daily",0,COLORS.panel)
    _button(Rect2(240,1210,285,90),"SOUND %s" % ("ON" if sound_on else "OFF"),"sound",0,COLORS.panel)
    _button(Rect2(555,1210,285,90),"VIBRATE %s" % ("ON" if vibration_on else "OFF"),"vibrate",0,COLORS.panel)
    _text("★ %d    COINS %d" % [_total_stars(),coins],Vector2(540,1450),32,COLORS.gold,true)

func _draw_levels() -> void:
    _header("SELECT LEVEL","home")
    for i in range(20):
        var id := max(1, unlocked-9)+i
        if id>100: break
        var col := i%4; var row := int(i/4)
        var rect := Rect2(90+col*230,300+row*230,190,180)
        var open := id<=unlocked
        draw_rect(rect,COLORS.panel if open else Color(0.08,0.1,0.14),true)
        draw_rect(rect,COLORS.cyan if open else Color(0.2,0.2,0.24),false,3)
        _text(str(id),rect.position+Vector2(95,72),36,COLORS.white if open else Color.GRAY,true)
        var st := int(stars.get(str(id),0))
        _text("★".repeat(st)+"☆".repeat(3-st),rect.position+Vector2(95,135),24,COLORS.gold if open else Color.GRAY,true)
        if open: buttons.append({"rect":rect,"action":"level","value":id})

func _draw_game() -> void:
    _header("LEVEL %d"%level_id,"home")
    _text("AMMO %d   NEED %d BOUNCES"%[ammo,required_bounces],Vector2(540,205),25,COLORS.white,true)
    if time_limit>0: _text("TIME %.1f"%maxf(0,time_limit-level_time),Vector2(870,205),24,COLORS.red,true)
    for well in wells:
        draw_circle(well.pos,float(well.radius),Color(0.4,0.1,0.8,0.09)); draw_arc(well.pos,float(well.radius),0,TAU,48,COLORS.purple,3)
    for portal in portals:
        draw_arc(portal.pos,float(portal.radius),level_time*2,level_time*2+5.2,32,COLORS.purple,10)
    for item in walls: _draw_item(item)
    for item in hazards: _draw_item(item)
    for item in glass: _draw_item(item)
    _draw_target()
    draw_circle(launcher,45,Color(0.1,0.5,0.7,0.3)); draw_arc(launcher,45,0,TAU,40,COLORS.cyan,4)
    if ball_active:
        for j in range(4,0,-1): draw_circle(ball_pos-ball_vel.normalized()*j*14,ball_radius-j*2,Color(COLORS.cyan,0.12*j))
        draw_circle(ball_pos,ball_radius,_ball_color())
    if trajectory.size()>1:
        for i in range(trajectory.size()-1): draw_dashed_line(trajectory[i],trajectory[i+1],Color(0.3,0.95,1,0.7),6,22)
    if message!="": _text(message,Vector2(540,1510),34,COLORS.gold,true)
    _button(Rect2(70,1745,220,80),"RESTART","restart",0,COLORS.panel)
    for p in particles: draw_circle(p.pos,5,Color(p.color,float(p.life)))

func _draw_item(item: Dictionary) -> void:
    if not bool(item.alive): return
    if str(item.kind)=="blink" and fmod(level_time,float(item.cycle)*2.0)>float(item.cycle): return
    var pts := PackedVector2Array()
    var h: Vector2=item.size*.5
    for p in [Vector2(-h.x,-h.y),Vector2(h.x,-h.y),Vector2(h.x,h.y),Vector2(-h.x,h.y)]: pts.append(item.pos+p.rotated(float(item.rot)))
    var c := COLORS.red if item.kind=="hazard" else (COLORS.glass if item.kind=="glass" else COLORS.cyan)
    draw_colored_polygon(pts,Color(c,0.35)); draw_polyline(PackedVector2Array([pts[0],pts[1],pts[2],pts[3],pts[0]]),c,4)

func _draw_target() -> void:
    draw_circle(target.pos,float(target.radius),Color(1,0.15,0.25,0.32)); draw_arc(target.pos,float(target.radius),0,TAU,40,COLORS.red,8)
    draw_circle(target.pos,15,COLORS.gold)
    if bool(target.shield):
        draw_arc(target.pos,float(target.radius)+22,float(target.shield_angle)+deg_to_rad(55),float(target.shield_angle)+TAU-deg_to_rad(55),48,COLORS.white,13)

func _draw_result() -> void:
    _text("RICOCHET COMPLETE" if result_win else "SHOT FAILED",Vector2(540,410),56,COLORS.green if result_win else COLORS.red,true)
    if result_win:
        _text("★".repeat(result_stars)+"☆".repeat(3-result_stars),Vector2(540,600),78,COLORS.gold,true)
        _text("SCORE %d"%result_score,Vector2(540,735),38,COLORS.white,true)
        _text("%d RICOCHETS  x%d"%[bounce_count,int(pow(2,bounce_count))],Vector2(540,810),28,COLORS.cyan,true)
    else: _text(message,Vector2(540,610),35,COLORS.white,true)
    _button(Rect2(230,980,620,110),"RETRY","restart",0,COLORS.panel)
    if result_win and level_id<100: _button(Rect2(230,1120,620,110),"NEXT LEVEL","next",0,COLORS.cyan)
    _button(Rect2(230,1260,620,100),"LEVELS","levels",0,COLORS.panel)

func _draw_shop() -> void:
    _header("PROJECTILES","home")
    var names := ["PULSE","HEAVY","VOLT","FROST","PHANTOM","SPLIT"]
    var prices := [0,300,500,650,850,1000]
    for i in range(6):
        var rect:=Rect2(110+(i%2)*450,330+int(i/2)*360,410,300)
        draw_rect(rect,COLORS.panel); draw_rect(rect,COLORS.gold if selected_ball==i else COLORS.cyan,false,4)
        draw_circle(rect.position+Vector2(205,90),38,[COLORS.cyan,COLORS.gold,COLORS.purple,Color.LIGHT_BLUE,COLORS.white,COLORS.green][i])
        _text(names[i],rect.position+Vector2(205,170),28,COLORS.white,true)
        var label := "SELECTED" if selected_ball==i else ("SELECT" if i in owned_balls else "%d COINS"%prices[i])
        _button(Rect2(rect.position+Vector2(55,210),Vector2(300,65)),label,"ball",i,COLORS.cyan if i in owned_balls else COLORS.gold)
    _text("COINS %d"%coins,Vector2(540,1500),32,COLORS.gold,true)

func _draw_daily() -> void:
    _header("DAILY CHALLENGE","home")
    _text("ONE SHOT. THREE BOUNCES.",Vector2(540,520),38,COLORS.white,true)
    _text("TODAY'S REWARD",Vector2(540,680),28,COLORS.cyan,true)
    _text("150 COINS",Vector2(540,780),64,COLORS.gold,true)
    var claimed := daily_stamp==Time.get_date_string_from_system()
    _button(Rect2(230,980,620,115),"CLAIMED" if claimed else "CLAIM REWARD","home" if claimed else "claim_daily",0,COLORS.panel if claimed else COLORS.cyan)

func _header(title: String, back_action: String) -> void:
    _button(Rect2(35,55,160,75),"BACK",back_action,0,COLORS.panel)
    _text(title,Vector2(540,105),44,COLORS.white,true)
    _text("COINS %d"%coins,Vector2(900,105),22,COLORS.gold,true)

func _button(rect: Rect2, label: String, action: String, value: int, color: Color) -> void:
    draw_style_box(_box(color),rect)
    _text(label,rect.position+rect.size*Vector2(.5,.58),28,COLORS.bg if color==COLORS.cyan or color==COLORS.gold else COLORS.white,true)
    buttons.append({"rect":rect,"action":action,"value":value})

func _box(color: Color) -> StyleBoxFlat:
    var b:=StyleBoxFlat.new(); b.bg_color=color; b.corner_radius_top_left=18; b.corner_radius_top_right=18; b.corner_radius_bottom_left=18; b.corner_radius_bottom_right=18; return b

func _text(t: String, pos: Vector2, size: int, color: Color, centered: bool) -> void:
    var font:=ThemeDB.fallback_font
    var p:=pos
    if centered: p.x-=font.get_string_size(t,HORIZONTAL_ALIGNMENT_LEFT,-1,size).x*.5
    draw_string(font,p,t,HORIZONTAL_ALIGNMENT_LEFT,-1,size,color)

func _ball_color() -> Color:
    return [COLORS.cyan,COLORS.gold,COLORS.purple,Color.LIGHT_BLUE,COLORS.white,COLORS.green][selected_ball]

func _select_or_buy(id: int) -> void:
    var prices := [0,300,500,650,850,1000]
    if id in owned_balls: selected_ball=id
    elif coins>=prices[id]: coins-=prices[id]; owned_balls.append(id); selected_ball=id
    _save()

func _claim_daily() -> void:
    var today:=Time.get_date_string_from_system()
    if daily_stamp!=today: daily_stamp=today; coins+=150; _save()
    screen=Screen.HOME

func _total_stars() -> int:
    var total:=0
    for v in stars.values(): total+=int(v)
    return total

func _save() -> void:
    var data={"unlocked":unlocked,"coins":coins,"stars":stars,"selected_ball":selected_ball,"owned_balls":owned_balls,"sound":sound_on,"vibration":vibration_on,"daily":daily_stamp}
    var f:=FileAccess.open(SAVE_PATH,FileAccess.WRITE)
    if f: f.store_string(JSON.stringify(data))

func _load_save() -> void:
    if not FileAccess.file_exists(SAVE_PATH): return
    var f:=FileAccess.open(SAVE_PATH,FileAccess.READ)
    if not f: return
    var d=JSON.parse_string(f.get_as_text())
    if not d is Dictionary: return
    unlocked=int(d.get("unlocked",1)); coins=int(d.get("coins",0)); stars=d.get("stars",{}); selected_ball=int(d.get("selected_ball",0))
    owned_balls=[]
    for v in d.get("owned_balls",[0]): owned_balls.append(int(v))
    sound_on=bool(d.get("sound",true)); vibration_on=bool(d.get("vibration",true)); daily_stamp=str(d.get("daily",""))
