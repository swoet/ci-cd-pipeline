async function loadHealth(){
  const el=document.getElementById('health');
  try{
    const res=await fetch('/api/health');
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data=await res.json();
    el.textContent = data.status || 'unknown';
    el.classList.add('ok');
  }catch(err){
    el.textContent='unhealthy';
  }
}
window.addEventListener('DOMContentLoaded',loadHealth);
