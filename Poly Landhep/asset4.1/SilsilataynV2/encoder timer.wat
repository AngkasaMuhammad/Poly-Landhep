
(module
	
	;;warna Language: Notepad++ ==>> Ada
	;;(global $str (import "myStrings" "") externref)

	(import "main" "lihat" (func $lih (param i32) (result i32)))
	(import "main" "auplay" (func $auplay (param externref) (result externref)))
	(import "main" "austop" (func $austop (param externref)))
	
	(import "main" "cce" (func $cce (param externref))) ;;createCommandEncoder
		(import "main" "brp" (func $brp (param externref))) ;;beginRenderPass
			(import "main" "sp" (func $sp (param externref))) ;;setPipeline
			(import "main" "svb" (func $svb (param i32 externref i32 i32))) ;;setVertexBuffer
			(import "main" "sib" (func $sib (param externref externref i32 i32))) ;;setIndexBuffer
			(import "main" "sbg" (func $sbg (param i32 externref))) ;;setBindGroup
			(import "main" "draw" (func $draw (param i32 i32 i32 i32))) ;;draw
			(import "main" "di" (func $di (param externref i32))) ;;drawIndirect
			(import "main" "dii" (func $dii (param externref i32))) ;;drawIndexedIndirect
			(import "main" "end" (func $end)) ;;end
		(import "main" "cttt" (func $cttt (param externref externref))) ;;
		(import "main" "finish" (func $finish)) ;;finish

(import "memory" "chara0misc" (memory $chara0misc 1))
(import "memory" "monyetbabimisc" (memory $monyetbabimisc 1))

(import "memory" "cobamemory0" (memory $mem0 1))

	;;(global $str (import "myStrings" "") externref)


(global $strsamplerbind (import "myStrings" "samplerbind") externref)
	
	;;enco0
	(global $strenco0 (import "myStrings" "enco0") externref)
		(global $strcamindr (import "myStrings" "camindr") externref)
		(global $strtanahindr (import "myStrings" "tanahindr") externref)
		(global $strchara0indr (import "myStrings" "chara0indr") externref)
		(global $strsubtitleindr (import "myStrings" "subtitleindr") externref)
		(global $strbungaindr (import "myStrings" "bungaindr") externref)
		(global $strkilatindr (import "myStrings" "kilatindr") externref)
		(global $strmonyetbabiindr (import "myStrings" "monyetbabiindr") externref)
		(global $strbatangindr (import "myStrings" "batangindr") externref)
		(global $strdaunindr (import "myStrings" "daunindr") externref)
		(global $strrumputindr (import "myStrings" "rumputindr") externref)
		
		;;ani
		(global $stranirp (import "myStrings" "ani rp") externref)
			(global $str_bufkosong (import "myStrings" "_bufkosong") externref)
			(global $struint16 (import "myStrings" "uint16") externref)
			(global $strANIpipe (import "myStrings" "ANIpipe") externref)
			
			;;cam
			(global $strCAM_bCAMani (import "myStrings" "CAM_bCAM ani") externref)
			(global $strCAM_bCAManibind (import "myStrings" "CAM_bCAM anibind") externref)
			
			;;chara0
			(global $strchara0ani (import "myStrings" "chara0ani") externref)
			(global $strchara0anibind (import "myStrings" "chara0 anibind") externref)
			
			;;monyetbabi
			(global $strmonyetbabiani (import "myStrings" "monyetbabiani") externref)
			(global $strmonyetbabianibind (import "myStrings" "monyet babi anibind") externref)
		
		;;arm
		(global $strarmrp (import "myStrings" "arm rp") externref)
			(global $strarmpipe (import "myStrings" "armpipe") externref)
			
			;;chara0
			(global $strchara0armbind (import "myStrings" "chara0 armbind") externref)
		
		;;mesh
		(global $strmeshrp (import "myStrings" "mesh rp") externref)
			
			;;tanah
			(global $strtanahpipe (import "myStrings" "tanahpipe") externref)
			(global $strtanahv (import "myStrings" "tanahv") externref)
			(global $strtanahi (import "myStrings" "tanahi") externref)
			(global $strtanahbind (import "myStrings" "tanahbind") externref)
			
			;;chara0
			(global $strchara0pipe (import "myStrings" "chara0pipe") externref)
			(global $strchara0v (import "myStrings" "chara0v") externref)
			(global $strchara0i (import "myStrings" "chara0i") externref)
			(global $strchara0bind (import "myStrings" "chara0bind") externref)
			
			;;subtitle
			(global $strsubtitlepipe (import "myStrings" "subtitlepipe") externref)
			(global $strsubtitlev (import "myStrings" "subtitlev") externref)
			(global $strsubtitlei (import "myStrings" "subtitlei") externref)
			(global $strsubtitlebind (import "myStrings" "subtitlebind") externref)
			
			;;bunga
			(global $strbungapipe (import "myStrings" "bungapipe") externref)
			(global $strbungav (import "myStrings" "bungav") externref)
			(global $strbungainst (import "myStrings" "bungainst") externref)
			(global $strbungai (import "myStrings" "bungai") externref)
			(global $strbungabind (import "myStrings" "bungabind") externref)
			
			;;kilat
			(global $strkilatpipe0 (import "myStrings" "kilatpipe0") externref)
			(global $strkilatpipe1 (import "myStrings" "kilatpipe1") externref)
			(global $strkilatv (import "myStrings" "kilatv") externref)
			(global $strkilati (import "myStrings" "kilati") externref)
			(global $strkilatbind (import "myStrings" "kilatbind") externref)
			
			;;monyetbabi
			(global $strmonyetbabibind (import "myStrings" "monyetbabibind") externref)
			
			;;monyet
			(global $strmonyetpipe (import "myStrings" "monyetpipe") externref)
			(global $strmonyetv (import "myStrings" "monyetv") externref)
			(global $strmonyeti (import "myStrings" "monyeti") externref)
			
			;;babi
			(global $strbabipipe (import "myStrings" "babipipe") externref)
			(global $strbabiv (import "myStrings" "babiv") externref)
			(global $strbabii (import "myStrings" "babii") externref)
			
			;;batang
			(global $strbatangpipe (import "myStrings" "batangpipe") externref)
			(global $strbatangv (import "myStrings" "batangv") externref)
			(global $strbatangi (import "myStrings" "batangi") externref)
			(global $strbatangbind (import "myStrings" "batangbind") externref)
			
			;;daun
			(global $strdaunpipe (import "myStrings" "daunpipe") externref)
			(global $strdaunv (import "myStrings" "daunv") externref)
			(global $strdauninst (import "myStrings" "dauninst") externref)
			(global $strdauni (import "myStrings" "dauni") externref)
			(global $strdaunbind (import "myStrings" "daunbind") externref)
			
			;;rumput
			(global $strrumputpipe (import "myStrings" "rumputpipe") externref)
			(global $strrumputv (import "myStrings" "rumputv") externref)
			(global $strrumputi (import "myStrings" "rumputi") externref)
			(global $strrumputbind (import "myStrings" "rumputbind") externref)
		
		;;fx
		(global $strfxretakrp (import "myStrings" "fxretak rp") externref)
			(global $strfxretakpipe (import "myStrings" "fxretakpipe") externref)
			(global $strfxretakbind (import "myStrings" "fxretakbind") externref)

	;;copy (canvas) to fxtex
	(global $strcontext (import "myStrings" "(context)") externref)
	(global $strfxtex (import "myStrings" "fxtex") externref)



;;audio
(global $straucon2 (import "myStrings" "aucon2") externref)



	;;audio
	(global $aucon2belumplay (mut i32) (i32.const 1))
	(global $aucon2belumstop (mut i32) (i32.const 1))
	
	;;
	(global $t (mut f32) (f32.const 0.))
	(global $aucon (mut externref) (ref.null extern))
	(func (export "main")
		(param $t0 f32)
		
		local.get $t0
		global.set $t
		
;;`````````````````````````|
		call $enco_enco0
;;_________________________|
	
	;;audio cont
	
			f32.const 3.1
			;;global.get $t
			i32.const 0 f32.load $mem0
		f32.lt
		global.get $aucon2belumplay
	i32.and
	if
		global.get $straucon2
		call $auplay
		global.set $aucon
		
		i32.const 0
		global.set $aucon2belumplay
	end
	
			f32.const 5.5
			;;global.get $t
			i32.const 0 f32.load $mem0
		f32.lt
		global.get $aucon2belumstop
	i32.and
	if
		global.get $aucon
		call $austop
		
		i32.const 0
		global.set $aucon2belumstop
	end
	)

	(func $enco_enco0
		;;enco0 +++++++++++++++++++
		global.get $strenco0
		call $cce
		
;;`````````````````````````|
		call $rp_enco0ani
		call $rp_enco0arm
		call $rp_enco0mesh
			global.get $strfxtex
			global.get $strcontext
		call $cttt
		call $rp_enco0fxretak
;;_________________________|
		
		call $finish
	)

	(func $rp_enco0ani
		;;ani +++++++++++++++++++
		global.get $stranirp
		call $brp
		
			global.get $strANIpipe
			call $sp
			
;;`````````````````````````|
				global.get $strCAM_bCAMani
				global.get $strCAM_bCAManibind
				global.get $strcamindr
				i32.const 0
				i32.const 1
			call $enco0ani...
				global.get $strchara0ani
				global.get $strchara0anibind
				global.get $strchara0indr
				i32.const 0 i32.load $chara0misc
				i32.const 4 i32.load $chara0misc
			call $enco0ani...
				global.get $strmonyetbabiani
				global.get $strmonyetbabianibind
				global.get $strmonyetbabiindr
				i32.const 0 i32.load $monyetbabimisc
				i32.const 4 i32.load $monyetbabimisc
			call $enco0ani...
;;_________________________|
		
		call $end
	)

	(func $enco0ani...
		(param $str...ani externref)
		(param $str...anibind externref)
		(param $str...indr externref)
		(param $indoff i32) ;;indirect offset, bukan per byte
		(param $bonelen i32) ;;jumlah bones
		
		(local $i i32)
		
		i32.const 0
		local.get $str...ani
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		i32.const 1
		local.get $str...ani
		i32.const 68
		i32.const -333 ;;omitted
		call $svb
		
		i32.const 2
		local.get $str...ani
		i32.const 136
		i32.const -333 ;;omitted
		call $svb
		
		i32.const 0
		local.get $str...anibind
		call $sbg
		
		i32.const 0 local.set $i
		(loop $lp
			local.get $str...indr
					local.get $i
					local.get $indoff
				i32.add
				i32.const 20
			i32.mul
			call $di
			
				local.get $i
				i32.const 1
			i32.add
			
				local.tee $i
				local.get $bonelen
			i32.lt_s
			br_if $lp
		)
	)

	(func $rp_enco0arm
		;;arm +++++++++++++++++++
		global.get $strarmrp
		call $brp
			
			global.get $strarmpipe
			call $sp
			
			i32.const 0
			global.get $str_bufkosong
			i32.const 0
			i32.const -333 ;;omitted
			call $svb
			
			i32.const 1
			global.get $str_bufkosong
			i32.const 0
			i32.const -333 ;;omitted
			call $svb
			
;;`````````````````````````|
			call $draw_enco0armchara0
;;_________________________|
			
		call $end
	)

	(func $draw_enco0armchara0
		;;chara0 +++++++++++++++++++
		i32.const 0
		global.get $strchara0armbind
		call $sbg
		
		global.get $strchara0indr
		i32.const 20
		call $di
	)

	(func $rp_enco0mesh
		;;mesh +++++++++++++++++++
		global.get $strmeshrp
		call $brp
			
			i32.const 1
			global.get $str_bufkosong
			i32.const 0
			i32.const -333 ;;omitted
			call $svb
			
;;`````````````````````````|
			call $draw_enco0meshtanah
			call $draw_enco0meshchara0
			call $draw_enco0meshbunga
			call $draw_enco0meshmonyetbabi
			call $draw_enco0meshbatang
			call $draw_enco0meshdaun
			call $draw_enco0meshrumput
			;;global.get $t f32.const 10.5 f32.gt if
			
					f32.const 10.5
					global.get $t
				f32.lt
					global.get $t
					f32.const 16
				f32.lt
			i32.and
			if
				call $draw_enco0meshkilat
			end
;;_________________________|
			
		call $end
	)

	(func $draw_enco0meshtanah
		;;tanah +++++++++++++++++++
		global.get $strtanahpipe
		call $sp
		
		i32.const 0
		global.get $strtanahv
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strtanahi
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		i32.const 0
		global.get $strtanahbind
		call $sbg
		
		global.get $strtanahindr
		i32.const 0
		call $dii
	)

	(func $draw_enco0meshchara0
		;;chara0 +++++++++++++++++++
		global.get $strchara0pipe
		call $sp
		
		i32.const 0
		global.get $strchara0v
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strchara0i
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		i32.const 0
		global.get $strchara0bind
		call $sbg
		
		global.get $strchara0indr
		i32.const 0
		call $dii
	)

	(func $draw_enco0meshbunga
		;;bunga +++++++++++++++++++
		global.get $strbungapipe
		call $sp
		
		i32.const 0
		global.get $strbungav
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		i32.const 1
		global.get $strbungainst
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strbungai
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		i32.const 0
		global.get $strbungabind
		call $sbg
		
		global.get $strbungaindr
		i32.const 0
		call $dii
	)

	(func $draw_enco0meshmonyetbabi
		i32.const 0
		global.get $strmonyetbabibind
		call $sbg
		
;;monyet +++++++++++++++++++
		i32.const 0
		global.get $strmonyetv
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strmonyeti
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		global.get $strmonyetpipe
		call $sp
		
		global.get $strmonyetbabiindr
		i32.const 0
		call $dii
		
;;babi +++++++++++++++++++
		i32.const 0
		global.get $strbabiv
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strbabii
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		global.get $strbabipipe
		call $sp
		
		global.get $strmonyetbabiindr
		i32.const 20
		call $dii
	)

	(func $draw_enco0meshkilat
		;;kilat +++++++++++++++++++
		
		i32.const 0
		global.get $strkilatv
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strkilati
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		i32.const 0
		global.get $strkilatbind
		call $sbg
		
		;;jelas
		global.get $strkilatpipe0
		call $sp
		global.get $strkilatindr
		i32.const 0
		call $dii
		
		;;samar
		global.get $strkilatpipe1
		call $sp
		global.get $strkilatindr
		i32.const 0
		call $dii
	)

	(func $draw_enco0meshbatang
		;;batang +++++++++++++++++++
		global.get $strbatangpipe
		call $sp
		
		i32.const 0
		global.get $strbatangv
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strbatangi
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		i32.const 0
		global.get $strbatangbind
		call $sbg
		
		global.get $strbatangindr
		i32.const 0
		call $dii
	)

	(func $draw_enco0meshdaun
		;;daun +++++++++++++++++++
		global.get $strdaunpipe
		call $sp
		
		i32.const 0
		global.get $strdaunv
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		i32.const 1
		global.get $strdauninst
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strdauni
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		i32.const 0
		global.get $strdaunbind
		call $sbg
		
		global.get $strdaunindr
		i32.const 0
		call $dii
	)

	(func $draw_enco0meshrumput
		;;rumput +++++++++++++++++++
		
		i32.const 0
		global.get $strrumputv
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strrumputi
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		i32.const 0
		global.get $strrumputbind
		call $sbg
		
		global.get $strrumputpipe
		call $sp
		global.get $strrumputindr
		i32.const 0
		call $dii
	)

	(func $rp_enco0fxretak
		global.get $strfxretakrp
		call $brp
			
			i32.const 1
			global.get $str_bufkosong
			i32.const 0
			i32.const -333 ;;omitted
			call $svb
			
					f32.const 10.5
					global.get $t
				f32.lt
(;========
					global.get $t
					f32.const 18
				f32.lt
			i32.and
--------;)
			if
				call $draw_fxretak
			end
			call $draw_enco0meshsubtitle
			
		call $end
	)

	(func $draw_fxretak
		
		global.get $strfxretakpipe
		call $sp
		
		i32.const 0
		global.get $str_bufkosong
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		i32.const 0
		global.get $strfxretakbind
		call $sbg
		
		i32.const 1
		global.get $strsamplerbind
		call $sbg
		
		i32.const 33 i32.const 3 i32.mul
		i32.const 1
		i32.const 0
		i32.const 0
		call $draw
			
	)

	(func $draw_enco0meshsubtitle
		;;subtitle +++++++++++++++++++
		global.get $strsubtitlepipe
		call $sp
		
		i32.const 0
		global.get $strsubtitlev
		i32.const 0
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strsubtitlei
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		i32.const 0
		global.get $strsubtitlebind
		call $sbg
		global.get $strsubtitleindr
		i32.const 0
		call $dii
	)

;;=+=+=+=+=+=+=+=+=+=+=+=+=
)
