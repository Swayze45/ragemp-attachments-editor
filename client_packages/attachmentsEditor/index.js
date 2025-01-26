var localPlayer = mp.players.local;

/** If you have another path, change it here */
const browser = mp.browsers.new('package://attachmentsEditor/index.html');
if (browser && mp.browsers.exists(browser)) browser.active = false;

let object = null;
let boneId = 0;
let modelName = '';

mp.keys.bind(0x75, true, () => {
  if (!browser.active) {
    mp.gui.cursor.show(true, true);
    browser.active = true;
  }
  else {
    onClose();
  }
})
 
const onClose = () => {
  mp.gui.cursor.show(false, false);

  if (browser && mp.browsers.exists(browser)) browser.active = false;
}

const onClear = () => {
  if (object && mp.objects.exists(object)) object.destroy();

  object = null;
  boneId = 0;
  modelName = '';
}

const onApply = (model, bone, positions) => {
  if (!mp.game.streaming.isModelInCdimage(mp.game.joaat(model))) return mp.console.logInfo('Invalid model', true, true);
  if (object) onClear();


  boneId = parseInt(bone);
  if (isNaN(boneId)) return mp.console.logInfo('Invalid bone', true, true);

  object = mp.objects.new(mp.game.joaat(model), new mp.Vector3(localPlayer.position.x, localPlayer.position.y, localPlayer.position.z - 5), {
    rotation: new mp.Vector3(0, 0, 0),
    alpha: 255,
    dimension: localPlayer.dimension
  });

  if (!object) return mp.console.logInfo('Failed to create object', true, true);

  modelName = mp.game.joaat(model);

  positions = JSON.parse(positions);

  setTimeout(() => {
    object.attachTo(
      localPlayer.handle,
      boneId,
      parseFloat(positions.offsetX),
      parseFloat(positions.offsetY),
      parseFloat(positions.offsetZ),
      parseFloat(positions.rotationX),
      parseFloat(positions.rotationY),
      parseFloat(positions.rotationZ),
      false,
      false,
      false,
      false,
      2,
      true
    );
  }, 200)
}

const onUpdatePosition = (positions) => {
  if (!object) return;

  positions = JSON.parse(positions);

  object.attachTo(
    localPlayer.handle,
    boneId,
    parseFloat(positions.offsetX),
    parseFloat(positions.offsetY),
    parseFloat(positions.offsetZ),
    parseFloat(positions.rotationX),
    parseFloat(positions.rotationY),
    parseFloat(positions.rotationZ),
    false,
    false,
    false,
    false,
    2,
    true
  );
}

const onReset = () => {
  onClear();
}

mp.events.add('cef::attachmentsEditor:updatePosition', onUpdatePosition.bind(this));
mp.events.add('cef::attachmentsEditor:reset', onReset.bind(this));
mp.events.add('cef::attachmentsEditor:apply', onApply.bind(this));
mp.events.add('cef::attachmentsEditor:close', onClose.bind(this));
